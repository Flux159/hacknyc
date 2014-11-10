var User = require('./models/user');
var Item = require('./models/item');
var Message = require('./models/message');

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
    var returnGroup = {
        '_id': group._id,
        'users': group.users,
        'name': group.name,
        'items': [],
        'messages': []
    };

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
        
        items.forEach(function(item) {
            returnGroup.items.push({
                title: item.title,
                icon: item.icon,
                chevin: item.chevin
            });
        });
//        var messageIds = [];
//        group.messages.forEach(function (message) {
//            messageIds.push(message);
//        });

        Message.find({group: group._id}, function(err, messages) {
            if(err) {
                console.log("ERROR IN HERE");
                console.log(err);
                callback(null);
            }
//            group.messages = messages;

            messages.forEach(function(message) {
                returnGroup.messages.push({
                    type: message.type,
                    user: message.user,
                    created_at: created_at
                });
            });

            callback(returnGroup);

        });
    });
//    return group;
};
