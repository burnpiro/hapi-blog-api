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
                reply({
                    code: 200,
                    data: categories
                });
            } else {
                reply(Boom.badImplementation(error));
            }
        });
    }
};

module.exports.create = {
    validate: {
        payload: {
            parent: Joi.any().default(''),
            path: Joi.any(),
            name: Joi.string().required(),
            type: Joi.string(),
            icon: Joi.string()
        }
    },
    auth: {
        strategy: 'token',
        scope: ['user', 'admin']
    },
    handler: function(request, reply) {
        var category = new Category(request.payload);
        category.save(function(error, category) {
            if(!error) {
                reply({message: 'Category created successfully', data: category});
            } else {
                if(11000 === error.code || 11001 === error.code) {
                    reply(Boom.forbidden('category id already taken'));
                } else {
                    reply(Boom.forbidden(error));
                }
            }
        });
    }
};

module.exports.search = {
    validate: {
        payload: {
            _id: Joi.string(),
            parent: Joi.any(),
            path: Joi.string(),
            name: Joi.string()
        }
    },
    auth: false,
    handler: function(request, reply) {
        if(!_.isUndefined(request.payload.name)) {
            request.payload.name = new RegExp(''+request.payload.name+'', "i");
        }
        Category.find(request.payload, function(error, categories) {
            if(!error) {
                if(_.isNull(categories)) {
                    reply(Boom.notFound('There is no categories added yet'));
                } else {
                    reply({
                        code: 200,
                        data: categories
                    });
                }
            } else {
                reply(Boom.badImplementation(error));
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
                } else {
                    reply({
                        code: 200,
                        data: category
                    });
                }
            } else {
                reply(Boom.notFound('Cannot find category with that ID'));
            }
        });
    }
};

module.exports.update = {
    validate: {
        payload: {
            parent: Joi.any().default(''),
            path: Joi.any(),
            name: Joi.string().required(),
            type: Joi.string(),
            icon: Joi.string()
        }
    },
    auth: {
        strategy: 'token',
        scope: ['user', 'admin']
    },
    handler: function(request, reply) {
        Category.findOneAndUpdate({
            _id: request.params.categoryId
        }, request.payload, {overwrite: true}, function(error, category) {
            if(error) {
                reply(Boom.badImplementation('Cannot update category'));
            } else {
                reply({message: 'Category updated successfully', data: category});
            }
        });
    }
};

module.exports.remove = {
    auth: {
        strategy: 'token',
        scope: ['user', 'admin']
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