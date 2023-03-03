import { join } from 'path';
import { ConnectionOptions } from 'typeorm';
import dotenv from 'dotenv';
import { UserEntity } from './databases/authentication/entity/users.entity';
import { CategoryEntity } from './databases/categorys/entity/category.entity';
import { PostEntity } from './databases/posts/entity/post.entity';
import { FullScreenPostEntity } from './databases/post_fullscreen/entity/postfullscreen.entity';
import { SubCategoryEntity } from './databases/subcategory/entity/subcategory.entity';
import { UserInfoEntity } from './databases/usersinfo/entity/user.infoentity';
import { ConnectionEntity } from './databases/connetcions/entity/connections.entity';
import { LikeEntity } from './databases/likes/entity/likes.entity';
import { BookmarkEntity } from './databases/bookmark/entity/bookmark.entity';
import { DownloadEntity } from './databases/downloads/entity/download.entity';
import { CommentEntity } from './databases/comments/entity/comment.entity';
import { ShareEntity } from './databases/share/entity/share.entity';
import { ViewsEntity } from './databases/views/entity/views.entity';
import { RewardEntity } from './databases/rewards/entity/reward.entity';
import { AmountEntity } from './databases/rewards/entity/amount.entity';
import { ContactusEntity } from './databases/contactus/enitiy/contactus.entity';
import { ReportsEntity } from './databases/reports/entity/reports.entity';

dotenv.config();
const connectionOptions: ConnectionOptions = {
  // url: process.env.DATABASE_URL,
  type: 'postgres',
  host: process.env.StatusHost || 'localhost',
  port: 5432,
  username: process.env.StatusUser || 'postgres',
  password: process.env.StatusDB_Password || 'dragon69',
  database: process.env.StatusDatabase || 'statusapp',
  synchronize: !process.env.DB_NO_SYNC,
  logging: !process.env.DB_NO_LOGS,
  entities: [
    UserEntity,
    UserInfoEntity,
    CategoryEntity,
    SubCategoryEntity,
    FullScreenPostEntity,
    PostEntity,
    ConnectionEntity,
    LikeEntity,
    BookmarkEntity,
    DownloadEntity,
    CommentEntity,
    ShareEntity,
    ViewsEntity,
    RewardEntity,
    AmountEntity,
    ContactusEntity,
    ReportsEntity,
  ],
  //   extra: {
  //     ssl: {
  //       rejectUnauthorized: false,
  //     },
  //   },
  dropSchema: false,
  migrationsRun: true,
  logger: 'debug',
  migrations: [join(__dirname, 'src/migration/**/*.ts')],
};

export = connectionOptions;
