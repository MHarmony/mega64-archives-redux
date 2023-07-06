import { DataSource } from 'typeorm';
import { Comment } from '../src/comments/entities/comment.entity';
import { Favorite } from '../src/favorites/entities/favorite.entity';
import { Media } from '../src/medias/entities/media.entity';
import { Reply } from '../src/replies/entities/reply.entity';
import { Report } from '../src/reports/entities/report.entity';
import { Tag } from '../src/tags/entities/tag.entity';
import { User } from '../src/users/entities/user.entity';

export default new DataSource({
  database: 'mega64_archives_redux_test',
  entities: [User, Tag, Comment, Reply, Report, Media, Favorite],
  host: 'localhost',
  password: 'password',
  port: 5432,
  synchronize: true,
  type: 'postgres',
  username: 'mega64_archives_redux_test',
  useUTC: true,
});
