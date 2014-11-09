var User = require('./models/user');

exports.trimGroup = function(group) {
    return {
        users: group.user,
        name: group.name,
        items: group.items,
        messages: group.messages
    }
};

exports.addGroupToUser = function(user_name, group) {
    // Add group to user record.
    User.findOne({username: user_name}, function(err, user) {
        if(err || !user) {
            console.log(err);
            return false;
        }
        user.group.push(group._id);
        user.save(function(err) {
            if(err) {
                console.log(err);
                return false;
            }    
        });
    });
    return true;
};

exports.buildGroupJson = function(group) {
    var itemIds = [];
    group.items.forEach(function (item) {
        itemIds.push(item);
    });
    Item.find({_id: {$in: itemIds}}, function(err, items) {
        if(err) {
            console.log(err);
            return null;
        }
        group.items = items;
        var messageIds = [];
        group.messages.forEach(function (message) {
            messageIds.push(message);
        });
        Message.find({_id: {$in: messageIds}}, function(err, messages) {
            if(err) {
                console.log(err);
                return null;
            }
            group.messages = messages;
        });
    });
    return group;       
};
