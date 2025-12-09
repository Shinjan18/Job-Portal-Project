const Job = require('./models/Job');

async function seedJobs() {
    try {
        const count = await Job.countDocuments();
        if (count >= 10) {
            console.log(`✓ Jobs collection has ${count} jobs (minimum 10), skipping seed`);
            return;
        }
        
        console.log(`⚠ Jobs collection has only ${count} jobs. Seeding 30 jobs...`);
        
        const samples = [
        { title: 'Frontend Developer', description: 'Build modern, responsive UI with React and TypeScript. Work with a talented team on cutting-edge web applications.', company: 'Awesome Co', salaryRange: '8-15 LPA', skillsRequired: ['React','TypeScript','CSS','HTML5'], experienceLevel: 'Junior', jobType: 'Full-time', location: 'Remote' },
        { title: 'Backend Engineer', description: 'Design and develop scalable APIs with Node.js and Express. Work with MongoDB to build robust backend systems.', company: 'Tech Corp', salaryRange: '10-20 LPA', skillsRequired: ['Node.js','Express','MongoDB','REST API'], experienceLevel: 'Mid', jobType: 'Full-time', location: 'Bengaluru' },
        { title: 'Full Stack Developer', description: 'Build end-to-end features across frontend and backend. Work with React, Node.js, and PostgreSQL in an agile environment.', company: 'NextGen Systems', salaryRange: '12-22 LPA', skillsRequired: ['React','Node.js','PostgreSQL','AWS'], experienceLevel: 'Mid', jobType: 'Hybrid', location: 'Hyderabad' },
        { title: 'React Native Engineer', description: 'Develop mobile applications for Android and iOS using React Native. Collaborate on cross-platform mobile solutions.', company: 'MobileX', salaryRange: '10-18 LPA', skillsRequired: ['React Native','TypeScript','CI/CD','Redux'], experienceLevel: 'Mid', jobType: 'Remote', location: 'Remote' },
        { title: 'DevOps Engineer', description: 'Automate deployment pipelines and manage cloud infrastructure. Work with Docker, Kubernetes, and AWS services.', company: 'Cloudify', salaryRange: '14-24 LPA', skillsRequired: ['Docker','Kubernetes','AWS','Jenkins'], experienceLevel: 'Senior', jobType: 'Full-time', location: 'Pune' },
        { title: 'Data Engineer', description: 'Build ETL pipelines and ensure data quality. Work with Python, Airflow, and SQL databases to process large datasets.', company: 'DataWorks', salaryRange: '12-20 LPA', skillsRequired: ['Python','Airflow','SQL','Spark'], experienceLevel: 'Mid', jobType: 'Full-time', location: 'Bengaluru' },
        { title: 'Machine Learning Engineer', description: 'Train and deploy ML models in production. Work with Python, PyTorch, and ML Ops tools to build AI solutions.', company: 'AI Labs', salaryRange: '15-28 LPA', skillsRequired: ['Python','PyTorch','TensorFlow','ML Ops'], experienceLevel: 'Senior', jobType: 'Remote', location: 'Remote' },
        { title: 'QA Automation Engineer', description: 'Develop and maintain automated test suites. Use Selenium, Cypress, and API testing tools to ensure quality.', company: 'QualityPlus', salaryRange: '8-14 LPA', skillsRequired: ['Selenium','Cypress','API Testing','Jest'], experienceLevel: 'Mid', jobType: 'Full-time', location: 'Noida' },
        { title: 'UI/UX Designer', description: 'Design user-friendly interfaces and create prototypes. Conduct user research and collaborate with developers.', company: 'DesignHub', salaryRange: '9-16 LPA', skillsRequired: ['Figma','Prototyping','User Research','Adobe XD'], experienceLevel: 'Mid', jobType: 'Contract', location: 'Remote' },
        { title: 'Site Reliability Engineer', description: 'Ensure system reliability and performance. Monitor infrastructure and respond to incidents.', company: 'Uptime Inc.', salaryRange: '16-26 LPA', skillsRequired: ['Linux','Observability','GCP','Prometheus'], experienceLevel: 'Senior', jobType: 'Full-time', location: 'Bengaluru' },
        { title: 'Product Manager', description: 'Lead product strategy and roadmap. Collaborate with engineering, design, and business teams.', company: 'RoadmapHQ', salaryRange: '18-30 LPA', skillsRequired: ['Product Strategy','Analytics','Communication','Agile'], experienceLevel: 'Senior', jobType: 'Hybrid', location: 'Gurugram' },
        { title: 'Security Engineer', description: 'Protect applications from security threats. Perform security audits and implement best practices.', company: 'SecureNet', salaryRange: '16-28 LPA', skillsRequired: ['OWASP','Threat Modeling','Node.js','Penetration Testing'], experienceLevel: 'Senior', jobType: 'Full-time', location: 'Chennai' },
        { title: 'Software Engineer - Python', description: 'Develop backend services using Python and Django. Build scalable applications for millions of users.', company: 'PythonTech', salaryRange: '10-18 LPA', skillsRequired: ['Python','Django','PostgreSQL','Celery'], experienceLevel: 'Mid', jobType: 'Full-time', location: 'Mumbai' },
        { title: 'iOS Developer', description: 'Build native iOS applications using Swift. Work on user-facing features for our mobile platform.', company: 'AppleDev Co', salaryRange: '12-22 LPA', skillsRequired: ['Swift','iOS','Xcode','UIKit'], experienceLevel: 'Mid', jobType: 'Full-time', location: 'Bangalore' },
        { title: 'Android Developer', description: 'Develop Android applications using Kotlin. Create smooth user experiences on mobile devices.', company: 'AndroidPro', salaryRange: '11-20 LPA', skillsRequired: ['Kotlin','Android','Jetpack','Room'], experienceLevel: 'Mid', jobType: 'Full-time', location: 'Delhi' },
        { title: 'Cloud Solutions Architect', description: 'Design cloud-native solutions on AWS. Guide teams on best practices and architecture decisions.', company: 'CloudFirst', salaryRange: '20-35 LPA', skillsRequired: ['AWS','Architecture','Terraform','CloudFormation'], experienceLevel: 'Senior', jobType: 'Remote', location: 'Remote' },
        { title: 'Blockchain Developer', description: 'Build decentralized applications using Solidity and Web3. Work on innovative blockchain projects.', company: 'BlockChainX', salaryRange: '15-28 LPA', skillsRequired: ['Solidity','Web3','Ethereum','Smart Contracts'], experienceLevel: 'Mid', jobType: 'Full-time', location: 'Remote' },
        { title: 'Game Developer', description: 'Create engaging games using Unity and C#. Work on game mechanics, physics, and player interactions.', company: 'GameStudio', salaryRange: '10-18 LPA', skillsRequired: ['Unity','C#','Game Design','3D Modeling'], experienceLevel: 'Mid', jobType: 'Full-time', location: 'Pune' },
        { title: 'Vue.js Developer', description: 'Build frontend applications with Vue.js. Create reusable components and optimize performance.', company: 'VueTech', salaryRange: '9-16 LPA', skillsRequired: ['Vue.js','JavaScript','Pinia','Vite'], experienceLevel: 'Junior', jobType: 'Full-time', location: 'Hyderabad' },
        { title: 'Angular Developer', description: 'Develop enterprise applications using Angular. Build complex forms and data visualization components.', company: 'AngularCorp', salaryRange: '11-19 LPA', skillsRequired: ['Angular','TypeScript','RxJS','Material UI'], experienceLevel: 'Mid', jobType: 'Full-time', location: 'Bangalore' },
        { title: 'Go Developer', description: 'Build high-performance backend services using Go. Work on microservices and distributed systems.', company: 'GoServices', salaryRange: '13-22 LPA', skillsRequired: ['Go','Microservices','Docker','gRPC'], experienceLevel: 'Mid', jobType: 'Full-time', location: 'Mumbai' },
        { title: 'Ruby on Rails Developer', description: 'Develop web applications using Ruby on Rails. Build features for our SaaS platform.', company: 'RailsApp', salaryRange: '10-18 LPA', skillsRequired: ['Ruby','Rails','PostgreSQL','RSpec'], experienceLevel: 'Mid', jobType: 'Remote', location: 'Remote' },
        { title: 'Java Spring Boot Developer', description: 'Build enterprise applications with Java and Spring Boot. Work on RESTful APIs and microservices.', company: 'JavaEnterprise', salaryRange: '12-21 LPA', skillsRequired: ['Java','Spring Boot','Hibernate','Maven'], experienceLevel: 'Mid', jobType: 'Full-time', location: 'Gurgaon' },
        { title: '.NET Developer', description: 'Develop applications using C# and .NET Core. Build web APIs and desktop applications.', company: 'DotNetSolutions', salaryRange: '11-20 LPA', skillsRequired: ['C#','.NET Core','Entity Framework','SQL Server'], experienceLevel: 'Mid', jobType: 'Full-time', location: 'Noida' },
        { title: 'PHP Laravel Developer', description: 'Build web applications using PHP and Laravel. Create APIs and manage database relationships.', company: 'LaravelTech', salaryRange: '9-16 LPA', skillsRequired: ['PHP','Laravel','MySQL','Composer'], experienceLevel: 'Mid', jobType: 'Full-time', location: 'Pune' },
        { title: 'Flutter Developer', description: 'Develop cross-platform mobile apps with Flutter. Create beautiful UIs and native integrations.', company: 'FlutterApps', salaryRange: '10-19 LPA', skillsRequired: ['Flutter','Dart','Firebase','Bloc'], experienceLevel: 'Mid', jobType: 'Remote', location: 'Remote' },
        { title: 'React Developer - Senior', description: 'Lead frontend development initiatives. Mentor junior developers and set technical standards.', company: 'ReactPro', salaryRange: '18-30 LPA', skillsRequired: ['React','TypeScript','Next.js','GraphQL'], experienceLevel: 'Senior', jobType: 'Full-time', location: 'Bangalore' },
        { title: 'Node.js Developer - Senior', description: 'Architect backend systems using Node.js. Design scalable microservices architecture.', company: 'NodeArch', salaryRange: '17-28 LPA', skillsRequired: ['Node.js','Express','Microservices','RabbitMQ'], experienceLevel: 'Senior', jobType: 'Remote', location: 'Remote' },
        { title: 'Frontend Architect', description: 'Define frontend architecture and best practices. Lead technical decisions and design systems.', company: 'ArchTech', salaryRange: '20-35 LPA', skillsRequired: ['React','Architecture','Design Systems','Performance'], experienceLevel: 'Senior', jobType: 'Hybrid', location: 'Mumbai' },
        { title: 'Backend Architect', description: 'Design scalable backend architectures. Lead technical initiatives and mentor teams.', company: 'BackendPro', salaryRange: '22-38 LPA', skillsRequired: ['System Design','Microservices','Kafka','Redis'], experienceLevel: 'Senior', jobType: 'Full-time', location: 'Bangalore' }
    ];
    
        const toInsert = samples.slice(0, 30);
        if (toInsert.length) {
            await Job.insertMany(toInsert);
            console.log(`✓ Seeded ${toInsert.length} jobs successfully`);
        }
    } catch (error) {
        console.error('✗ Error seeding jobs:', error.message);
    }
}

module.exports = { seedJobs };

