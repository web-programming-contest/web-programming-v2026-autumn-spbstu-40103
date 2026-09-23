export class User {
  constructor(id, name, friends = []) {
    this.id = id;
    this.name = name;
    this.friends = [...friends];
  }

  addFriend(friendId) {
    if (this.id === friendId) {
      return false;
    }
    if (!this.friends.includes(friendId)) {
      this.friends.push(friendId);
      return true;
    }
    return false;
  }

  removeFriend(friendId) {
    this.friends = this.friends.filter((id) => id !== friendId);
  }

  get friendCount() {
    return this.friends.length;
  }
}

export function groupUsersByFriendCount(users) {
  const groups = new Map();
  for (const user of users) {
    const count = user.friendCount;
    if (!groups.has(count)) {
      groups.set(count, []);
    }
    groups.get(count).push(user);
  }
  return groups;
}

export function getUniqueFriends(users) {
  const unique = new Set();
  for (const user of users) {
    for (const friendId of user.friends) {
      unique.add(friendId);
    }
  }
  return [...unique];
}

export function findUsersWithFriend(users, friendId) {
  return users.filter((user) => user.friends.includes(friendId));
}

export function findUsersAboveFriendCount(users, count) {
  return users.filter((user) => user.friendCount > count);
}

export function findUsersWithoutFriends(users) {
  return users.filter((user) => user.friendCount === 0);
}
