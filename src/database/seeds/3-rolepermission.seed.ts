import { Permissions } from "../../users/entities/permission.entity";
import { Role } from "../../users/entities/role.entity";
import { DataSource } from "typeorm";
import { Seeder } from "typeorm-extension";

export default class RoleSeeder implements Seeder{
    public async run(datasource:DataSource):Promise<void>{

        console.log('role seeder is running');

        const RoleRepo = datasource.getRepository(Role);
        const PermissionRepo = datasource.getRepository(Permissions);

        // create permissions
        const CreateCourse = PermissionRepo.create({
                permission_name: "create_course"
        });

        const DeleteCourse = PermissionRepo.create({
                permission_name: "delete_course"
        });

        const ViewCourse = PermissionRepo.create({
                permission_name: "view_course"
        });

        const AddTeacher = PermissionRepo.create({
                permission_name: "add_teacher"
        });

        const DeleteTeacher = PermissionRepo.create({
                permission_name: "delete_teacher"
        });

        await PermissionRepo.save([
                CreateCourse,
                DeleteCourse,
                ViewCourse,
                AddTeacher,
                DeleteTeacher
        ]);

        // create roles

        const SuperAdmin = RoleRepo.create({
                name: "Super Admin",
                slug: "super-admin",
                permissions: [
                        CreateCourse,
                        DeleteCourse,
                        ViewCourse,
                        AddTeacher,
                        DeleteTeacher
                ]
        });

        const Teacher = RoleRepo.create({
                name: "Teacher",
                slug: "teacher",
                permissions: [
                        CreateCourse,
                        DeleteCourse
                ]
        });

        const Student = RoleRepo.create({
                name: "Student",
                slug: "student",
                permissions: [
                        ViewCourse
                ]
        });

        const Admin = RoleRepo.create({
                name: "Admin",
                slug: "admin",
                permissions: [
                        AddTeacher,
                        DeleteTeacher
                ]
        });

        await RoleRepo.save([
                SuperAdmin,
                Teacher,
                Student,
                Admin
        ]);
    }
}
