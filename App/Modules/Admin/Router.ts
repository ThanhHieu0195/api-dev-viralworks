import { Injectable } from 'System/Injectable';
import { IRoute, IRouter } from 'System/Interface';
import { HTTP } from 'System/Enum';

import { AuthController } from './Controllers/AuthController';
import { RoleController } from './Controllers/RoleController';
import { UserController } from './Controllers/UserController';
import { AuthenticationMiddleware } from './Middleware/AuthenticationMiddleware';

@Injectable
export class Router implements IRouter {
    readonly routes: IRoute[];
    constructor(
        // Controller
        readonly roleController: RoleController,
        readonly authController: AuthController,
        readonly userController: UserController,

        // Middleware
        readonly authenticationMiddleware: AuthenticationMiddleware
    ) {
        this.routes = [
            { path: '/auth', method: HTTP.Post, handler: this.authController.postLogin },
            { path: '/users/create', method: HTTP.Post, handler: this.userController.createUser },
            { path: '/users/{id}', method: HTTP.Get, handler: this.userController.getUserById },
            {
                middleware: [{ class: this.authenticationMiddleware }],
                group: [
                    { path: '/auth/check', method: HTTP.Get, handler: this.authController.getCheckToken },

                    { path: '/paths', method: HTTP.Get, handler: this.roleController.getPaths },

                    { path: '/entries/create', method: HTTP.Post, handler: this.roleController.createEntry },
                    { path: '/entries/add-roles/{id}', method: HTTP.Post, handler: this.roleController.setEntries },                    
                    { path: '/entries/{id}', method: HTTP.Get, handler: this.roleController.getPermissionById },
                    { path: '/entries', method: HTTP.Get, handler: this.roleController.getPermissions },

                    { path: '/roles/create', method: HTTP.Post, handler: this.roleController.createRole },
                    { path: '/roles/update/{id}', method: HTTP.Put, handler: this.roleController.updateRole },
                    { path: '/roles/delete/{id}', method: HTTP.Delete, handler: this.roleController.deleteRoleById },                    
                    { path: '/roles/{id}', method: HTTP.Get, handler: this.roleController.getRoleById },
                    { path: '/roles', method: HTTP.Get, handler: this.roleController.getRoles }
                ]
            }
        ];
    }
}