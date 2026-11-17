import http from 'node:http';
import {readFile,writeFile,rename} from 'node:fs/promises';
import {randomUUID} from 'node:crypto';
const base=new URL('./data/',import.meta.url), sessions=new Map();
let queue=Promise.resolve();
export const server=http.createServer(async(req,res)=>{
 res.setHeader('Access-Control-Allow-Origin','http://localhost:3000');
 res.setHeader('Access-Control-Allow-Credentials','true');
 res.setHeader('Access-Control-Allow-Headers','Content-Type');
 res.setHeader('Access-Control-Allow-Methods','GET, POST, OPTIONS');
 const send=(s,x)=>{res.writeHead(s,{'Content-Type':'application/json; charset=utf-8'});
 res.end(JSON.stringify(x))
};

 if(req.method==='OPTIONS'){res.writeHead(204);return res.end()}
 try{
 let body={};
 if(req.method==='POST'){
    let raw='';
    for await(const part of req){
        raw+=part;
        if(raw.length>100000)
            return send(413,{error:'Слишком большой запрос'})
    }
    body=JSON.parse(raw||'{}')
}

 const token=(req.headers.cookie||'').split('; ').find(x=>x.startsWith('sid='))?.slice(4);
 const active=sessions.get(token)>Date.now();

 if(req.url==='/login'&&req.method==='POST'){
 if(body.login!=='student'||body.password!=='gadget123')
    return send(401,{error:'Такого пользователя нет, возможно неправильный логин или пароль - проверьте данные'});
 const sid=randomUUID();
 sessions.set(sid,Date.now()+86400000);
 res.setHeader('Set-Cookie',`sid=${sid}; HttpOnly; SameSite=Lax; Path=/; Max-Age=86400`);
 return send(200,{user:'student'});
 }

 if(req.url==='/logout'&&req.method==='POST'){
    sessions.delete(token);
    res.setHeader('Set-Cookie','sid=; HttpOnly; SameSite=Lax; Path=/; Max-Age=0');
    return send(200,{ok:true})
}

 if(req.url==='/session')return send(200,{user:active?'student':null});

 const goods=JSON.parse(await readFile(new URL('goods.json',base),'utf8'));
 if(req.url==='/goods'&&req.method==='GET')return send(200,goods);

 if(!active)return send(401,{error:'Войдите в систему'});

 if(req.url==='/orders'&&req.method==='GET'){
    await queue;
    return send(200,JSON.parse(await readFile(new URL('orders.json',base),'utf8')))
}

 if(req.url==='/orders'&&req.method==='POST'){
 if(!/^\+?[\d ()-]{7,25}$/.test(body.phone||'')||!['pickup','delivery'].includes(body.delivery)||!['card','cash'].includes(body.payment)||body.delivery==='delivery'&&!body.address?.trim()||body.email&&!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.email)||!Array.isArray(body.items)||!body.items.length)return send(400,{error:'Проверьте поля заказа'});

 const items=body.items.map(x=>{const g=goods.find(g=>g.id===x.id);
    if(!g||!Number.isInteger(x.quantity)||x.quantity<1||x.quantity>99)throw Error('Некорректный товар');
    return {id:g.id,name:g.name,price:g.price,quantity:x.quantity}});

 const order={id:randomUUID(),number:0,date:new Date().toISOString(),items,total:items.reduce((s,x)=>s+x.price*x.quantity,0),phone:body.phone,email:body.email||'',delivery:body.delivery,address:body.delivery==='delivery'?body.address:'',payment:body.payment,packaging:!!body.packaging};

 const save=queue.then(async()=>{
    const file=new URL('orders.json',base),tmp=new URL('orders.tmp',base);
    const orders=JSON.parse(await readFile(file,'utf8'));

    order.number=orders.reduce((m,o)=>Math.max(m,o.number||0),100000)+1;
    orders.unshift(order);

    await writeFile(tmp,JSON.stringify(orders,null,2));
    await rename(tmp,file)
});
 queue=save.catch(()=>{});
 await save;
 return send(201,order);
}
 send(404,{error:'Не найдено'});
 }
 catch(e){
    send(400,{error:e instanceof SyntaxError?'Некорректный JSON':'Не удалось обработать запрос'})}
});

server.listen(8080,'localhost',()=>console.log('API: http://localhost:8080'));
