function findCompatibleFriend(user, friendsToMatch) {
    let diffs = [];

    friendsToMatch.forEach(friend => {

        let diff = 0;

        user.scores.forEach((userScore, index) => {
            diff += Math.abs(userScore - friend.scores[index]);
        });

        diffs.push(diff);
    });

    let smallestDiff = Math.min(...diffs);
    let matchedFriend = friendsToMatch[diffs.indexOf(smallestDiff)];

    return matchedFriend;
}

module.exports = { findCompatibleFriend };