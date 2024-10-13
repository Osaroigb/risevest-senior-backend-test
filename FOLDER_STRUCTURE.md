OPENSAUCE
|
├── logs
│ │
│ ├── combined.log
│ └── error.log
│
├── src
│ │
│ ├── config
│ │ │
│ │ ├── app.ts
│ │ ├── database.ts
│ │ ├── interface.ts
│ │ ├── ormconfig.ts
│ │ └── redis.ts
│ │
│ ├── entities
│ │ │
│ │ ├── Comment.entity.ts
│ │ ├── Post.entity.ts
│ │ └── User.entity.ts
│ │
│ ├── errors
│ │ │
│ │ ├── BadRequestError.ts
│ │ ├── ConflictError.ts
│ │ ├── DomainError.ts
│ │ ├── InternalServerError.ts
│ │ ├── ResourceNotFoundError.ts
│ │ ├── UnAuthorizedError.ts
│ │ └── UnprocessableEntityError.ts
│ │
│ ├── helpers
│ │ │
| │ ├── errorHandler.ts
| │ ├── server.ts
│ │ └── utilities.ts
│ │
│ ├── middlewares
│ │ │
| │ ├── authenticate.ts
| │ ├── comment.validation.ts
| │ ├── post.validation.ts
│ │ └── user.validation.ts
│ │
│ ├── modules
│ │ │ │ 
│ │ │ └── comment
│ │ │ │  │
│ │ | │  ├── comment.controller.ts
│ │ | │  ├── comment.dto.ts
│ │ │ │  └── comment.service.ts
│ │ │ │
│ │ │ └── performance
│ │ │ │  │
│ │ | │  ├── index.ts
│ │ | │  ├── performance.controller.ts
│ │ | │  ├── performance.route.ts
│ │ │ │  └── performance.service.ts
│ │ │ │
│ │ │ └── post
│ │ │ │  │
│ │ | │  ├── index.ts
│ │ | │  ├── post.controller.ts
│ │ | │  ├── post.dto.ts
│ │ | │  ├── post.route.ts
│ │ │ │  └── post.service.ts
│ │ │ │
│ │ │ └── user
│ │ │    │
│ │ |    ├── index.ts
│ │ |    ├── user.controller.ts
│ │ |    ├── user.dto.ts
│ │ |    ├── user.route.ts
│ │ │    └── user.service.ts
│ │ │ 
│ │ └── routes.ts
│ │
│ ├── pagination
│ │ │
| │ ├── page-meta.dto.ts
| │ ├── page-options.dto.ts
│ │ └── page.dto.ts
│ │
│ ├── types
│ │ │
│ │ └── custom.d.ts
│ │
│ ├── utils
│ │ │
| │ ├── constant.ts
│ │ └── logger.ts
│ │
│ ├── app.ts
│ │
│ └── server.ts
│
├── tests
│ │ 
│ ├── comment.controller.test.ts
│ ├── post.controller.test.ts
│ └── user.controller.test.ts
|
├── .editorconfig
|
├── .env.sample
|
├── .eslintrc.js
|
├── .gitignore
|
├── .nvmrc
|
├── .prettierignore
|
├── .prettierrc
|
├── docker-compose.yml
|
├── Dockerfile
|
├── FOLDER_STRUCTURE.md
|
├── heroku.yml
|
├── jest.config.ts
|
├── LICENSE
|
├── package-lock.json
|
├── package.json
|
├── README.md
|
├── tsconfig.build.json
|
└── tsconfig.json
