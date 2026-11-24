export class User {
  constructor(id, name, friends = []) {
    this.id = id;
    this.name = name;
    this.friends = [...new Set(friends)];
  }

  addFriend(friendId) {
    if (this.friends.includes(friendId)) {
      return false;
    }

    this.friends.push(friendId);
    return true;
  }

  removeFriend(friendId) {
    const index = this.friends.indexOf(friendId);

    if (index === -1) {
      return false;
    }

    this.friends.splice(index, 1);
    return true;
  }

  get friendCount() {
    return this.friends.length;
  }
}

export function groupUsersByFriendCount(users) {
  const groups = new Map();

  for (const user of users) {
    const count = user.friends.length;

    if (!groups.has(count)) {
      groups.set(count, []);
    }

    groups.get(count).push(user);
  }

  return groups;
}

export function getUniqueFriends(users) {
  return [...new Set(users.flatMap((user) => user.friends))];
}

export function findUsersWithFriend(users, friendId) {
  return users.filter((user) => user.friends.includes(friendId));
}

export function findUsersAboveFriendCount(users, count) {
  return users.filter((user) => user.friends.length > count);
}

export function findUsersWithoutFriends(users) {
  return users.filter((user) => user.friends.length === 0);
}
