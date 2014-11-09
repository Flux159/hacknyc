var User = require('./models/user');

exports.trimGroup = function(group) {
    return {
        id: group._id,
        name: group.name,
        users: group.users,
        items: group.items,
        messages: group.messages
    };
};

exports.addGroupToUser = function(user_name, group, callback) {
    // Add group to user record.
    User.findOne({username: user_name}, function(err, user) {
        if(err || !user) {
            console.log(err);
            callback(false);
        }

        user.groups.push(group._id);
        user.markModified('groups');

        user.save(function(err) {
            if(err) {
                console.log(err);
                callback(false);
            }
            callback(true);
        });
    });
};

exports.buildGroupJson = function(group, callback) {
    var itemIds = [];
    group.items.forEach(function (item) {
        itemIds.push(item);
    });
    Item.find({_id: {$in: itemIds}}, function(err, items) {
        if(err) {
            console.log(err);
//            return null;
            callback(null);
        }
//        group.items = items;

        var returnItems = [];
        items.forEach(function(item) {
            returnItems.push({
                title: item.title,
                icon: item.icon,
                chevin: item.chevin
            });
        });
        group.items = returnItems;

//        var messageIds = [];
//        group.messages.forEach(function (message) {
//            messageIds.push(message);
//        });

        Message.find({group: group.name}, function(err, messages) {
            if(err) {
                console.log(err);
                callback(null);
            }
//            group.messages = messages;

            var returnMessages = [];
            messages.forEach(function(message) {
                returnMessages.push({
                    type: message.type,
                    user: message.user,
                    created_at: created_at
                });
            });

            group.messages = returnMessages;

            callback(group);

        });
    });
//    return group;
};