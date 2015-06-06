var Joi = require('joi');
var _ = require('lodash');
var Boom = require('boom');
var Category = require('../categories/category.model');

module.exports.getAll = {
    auth: false,
    handler: function(request, reply) {
        Category.find({}, function(error, categories) {
            if(!error) {
                if(_.isNull(categories)) {
                    reply(Boom.notFound('There is no categories added yet'));
                }
                reply(categories);
            } else {
                reply(Boom.badImplementation(error));
            }
        });
    }
};

module.exports.create = {
    validate: {
        payload: {
            _id: Joi.string().required(),
            parent: Joi.string(),
            path: Joi.string().required(),
            name: Joi.string().required()
        }
    },
    auth: {
        strategy: 'token',
        scope: ['user']
    },
    handler: function(request, reply) {
        var category = new Category(request.payload);
        category.save(function(error, category) {
            if(!error) {
                reply(category).created('/categories/' + category._id);
            } else {
                if(11000 === error.code || 11001 === error.code) {
                    reply(Boom.forbidden('category id already taken'));
                } else {
                    reply(Boom.forbidden(getErrorMessageFrom(error)));
                }
            }
        });
    }
};

module.exports.getOne = {
    auth: false,
    handler: function(request, reply) {
        Category.findOne({
            _id: request.params.categoryId
        }, function(error, category) {
            if(!error) {
                if(_.isNull(category)) {
                    reply(Boom.notFound('Cannot find category with that ID'));
                }
                reply(category);
            } else {
                reply(Boom.notFound('Cannot find category with that ID'));
            }
        });
    }
};

module.exports.update = {
    validate: {
        payload: {
            parent: Joi.string(),
            path: Joi.string().required(),
            name: Joi.string().required()
        }
    },
    auth: {
        strategy: 'token',
        scope: ['user']
    },
    handler: function(request, reply) {
        Category.findOneAndUpdate({
            _id: request.params.categoryId
        }, request.payload, {overwrite: true}, function(error) {
            if(error) {
                reply(Boom.badImplementation('Cannot update category'));
            }
            reply({message: 'Category updated successfully'});
        });
    }
};

module.exports.remove = {
    auth: {
        strategy: 'token',
        scope: ['user']
    },
    handler: function(request, reply) {
        Category.findOne({
            _id: request.params.categoryId
        }, function(error, category) {
            if(error) {
                reply(Boom.badImplementation('Cannot remove category'));
            }
            if(_.isNull(category)) {
                reply(Boom.notFound('Cannot find category with that ID'));
            }
            category.remove();
            reply({message: 'Category removed successfully'})
        });
    }
};