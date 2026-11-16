package com.resolveit.config;

import com.resolveit.common.Constants;
import com.resolveit.department.DepartmentMemberRepository;
import com.resolveit.department.DepartmentRepository;
import com.resolveit.entity.Department;
import com.resolveit.entity.DepartmentMember;
import com.resolveit.entity.Role;
import com.resolveit.entity.User;
import com.resolveit.user.RoleRepository;
import com.resolveit.user.UserRepository;
import com.resolveit.workflow.MemberType;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@Component
@ConditionalOnProperty(name = "app.seed.enabled", havingValue = "true", matchIfMissing = true)
public class DemoDataSeeder implements ApplicationRunner {

    private static final Logger log = LoggerFactory.getLogger(DemoDataSeeder.class);

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final DepartmentRepository departmentRepository;
    private final DepartmentMemberRepository departmentMemberRepository;
    private final PasswordEncoder passwordEncoder;

    public DemoDataSeeder(UserRepository userRepository,
                          RoleRepository roleRepository,
                          DepartmentRepository departmentRepository,
                          DepartmentMemberRepository departmentMemberRepository,
                          PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.departmentRepository = departmentRepository;
        this.departmentMemberRepository = departmentMemberRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    @Transactional
    public void run(ApplicationArguments args) {
        Role adminRole = getRole(Constants.ROLE_ADMIN);
        Role managerRole = getRole(Constants.ROLE_MANAGER);
        Role employeeRole = getRole(Constants.ROLE_EMPLOYEE);
        Role userRole = getRole(Constants.ROLE_USER);

        ensureUser("System Admin", "admin@resolveit.local", "Admin@1234", adminRole);
        ensureUser("Aarav Sharma", "user@resolveit.local", "User@1234", userRole);
        ensureUser("Priya Verma", "priya@resolveit.local", "User@1234", userRole);

        seedDepartment("Facilities & Maintenance", "Rohan Mehta", "manager@resolveit.local",
                "Vikram Singh", "employee@resolveit.local", managerRole, employeeRole);
        seedDepartment("IT & Network Services", "Neha Kapoor", "it.manager@resolveit.local",
                "Karan Patel", "it.staff@resolveit.local", managerRole, employeeRole);
        seedDepartment("Hostel & Sanitation", "Ananya Rao", "hostel.manager@resolveit.local",
                "Arjun Das", "hostel.staff@resolveit.local", managerRole, employeeRole);
        seedDepartment("Academic & Administration", "Meera Iyer", "academic.manager@resolveit.local",
                "Ravi Kumar", "academic.staff@resolveit.local", managerRole, employeeRole);

        log.info("Demo seed complete: ensured admin, complainants, and manager/employee accounts for all departments");
    }

    private void seedDepartment(String departmentName,
                                String managerName,
                                String managerEmail,
                                String employeeName,
                                String employeeEmail,
                                Role managerRole,
                                Role employeeRole) {
        Department department = departmentRepository.findByNameIgnoreCase(departmentName).orElse(null);
        if (department == null) {
            log.warn("Skipping demo staff for missing department '{}'; run database seed migrations first", departmentName);
            return;
        }

        User manager = ensureUser(managerName, managerEmail, "Manager@1234", managerRole);
        User employee = ensureUser(employeeName, employeeEmail, "Employee@1234", employeeRole);
        ensureMember(department, manager, MemberType.MANAGER);
        ensureMember(department, employee, MemberType.EMPLOYEE);
    }

    private Role getRole(String name) {
        return roleRepository.findByName(name)
                .orElseGet(() -> roleRepository.save(new Role(name)));
    }

    private User ensureUser(String name, String email, String rawPassword, Role role) {
        return userRepository.findByEmailIgnoreCase(email).orElseGet(() -> {
            User user = new User();
            user.setName(name);
            user.setEmail(email);
            user.setPasswordHash(passwordEncoder.encode(rawPassword));
            user.setRole(role);
            user.setActive(true);
            return userRepository.save(user);
        });
    }

    private void ensureMember(Department department, User user, MemberType type) {
        DepartmentMember membership = departmentMemberRepository
                .findByDepartmentIdAndUserId(department.getId(), user.getId())
                .orElseGet(DepartmentMember::new);
        membership.setDepartment(department);
        membership.setUser(user);
        membership.setMemberType(type);
        membership.setActive(true);
        departmentMemberRepository.save(membership);
    }
}
