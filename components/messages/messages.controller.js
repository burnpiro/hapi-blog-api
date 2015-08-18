var Joi = require('joi');
var _ = require('lodash');
var Boom = require('boom');
var Message = require('./message.model');

module.exports.getAll = {
    auth: {
        strategy: 'token',
        scope: ['admin']
    },
    handler: function(request, reply) {
        Message.find({}, null, {sort: {createdAt: -1}},  function(error, messages) {
            if(!error) {
                if(_.isNull(messages)) {
                    reply(Boom.notFound('There is no messages added yet'));
                }
                reply({code: 200, data: messages});
            } else {
                reply(Boom.badImplementation(error));
            }
        });
    }
};

module.exports.create = {
    validate: {
        payload: {
            title: Joi.string().required(),
            email: Joi.string().required(),
            author: Joi.string().required(),
            content: Joi.string().required()
        }
    },
    auth: false,
    handler: function(request, reply) {
        var message = new Message(request.payload);
        message.save(function(error, message) {
            if(!error) {
                reply({
                    code: 200,
                    message: 'Message send successfully'
                });
            } else {
                reply(Boom.forbidden('Cannot send message'));
            }
        });
    }
};


module.exports.remove = {
    auth: {
        strategy: 'token',
        scope: ['admin']
    },
    handler: function(request, reply) {
        Message.findOne({
            _id: request.params.messageId
        }, function(error, message) {
            if(error) {
                reply(Boom.badImplementation('Cannot remove message'));
            }
            if(_.isNull(message)) {
                reply(Boom.notFound('Cannot find message with that ID'));
            }
            message.remove();
            reply({message: 'Message removed successfully'})
        });
    }
};