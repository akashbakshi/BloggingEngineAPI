import {MigrationInterface, QueryRunner} from "typeorm";

export class InitialMigration1577586965075 implements MigrationInterface {
    name = 'InitialMigration1577586965075'

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("CREATE TABLE `posts` (`id` int NOT NULL AUTO_INCREMENT, `title` varchar(255) NOT NULL, `content` varchar(255) NOT NULL, `author` varchar(255) NOT NULL, `postedAt` datetime NOT NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB", undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("DROP TABLE `posts`", undefined);
    }

}
