function getId(value) {
  if (typeof value === 'object' && value !== null) {
    return value.id;
  }

  return value;
}

function sameId(first, second) {
  return String(first) === String(second);
}

export class User {
  constructor(id, name, friends = []) {
    this.id = id;
    this.name = name;
    this.friends = friends.map((friend) => getId(friend));
  }

  get friendCount() {
    return this.friends.length;
  }

  addFriend(friend) {
    const friendId = getId(friend);
    const exists = this.friends.some((item) => sameId(item, friendId));

    if (sameId(friendId, this.id) || exists) {
      return;
    }

    this.friends.push(friendId);
  }

  removeFriend(friend) {
    const friendId = getId(friend);

    this.friends = this.friends.filter((item) => !sameId(item, friendId));
  }
}

export function groupUsersByFriendCount(users) {
  const groups = {};

  for (const user of users) {
    const count = user.friends.length;

    if (!groups[count]) {
      groups[count] = [];
    }

    groups[count].push(user);
  }

  return groups;
}

export function getUniqueFriends(users) {
  const unique = [];

  for (const user of users) {
    for (const friend of user.friends) {
      const friendId = getId(friend);

      if (!unique.some((item) => sameId(item, friendId))) {
        unique.push(friendId);
      }
    }
  }

  return unique;
}

export function findUsersWithFriend(users, friend) {
  const friendId = getId(friend);

  return users.filter((user) =>
    user.friends.some((item) => sameId(getId(item), friendId)),
  );
}

export function findUsersAboveFriendCount(users, count = 0) {
  return users.filter((user) => user.friends.length > count);
}

export function findUsersWithoutFriends(users) {
  return users.filter((user) => user.friends.length === 0);
}
