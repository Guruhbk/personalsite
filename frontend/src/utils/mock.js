import { Cloud, Server, GitBranch, Code2, Database, Wrench } from 'lucide-react';

export const mockData = {
  skills: [
    {
      category: 'Cloud & Infrastructure',
      icon: <Cloud className="w-5 h-5" />,
      items: ['AWS', 'SAP BTP', 'EC2', 'S3', 'CloudFront', 'Lambda', 'RDS']
    },
    {
      category: 'Containerization',
      icon: <Server className="w-5 h-5" />,
      items: ['Docker', 'Kubernetes', 'EKS', 'Helm', 'SAP Kyma', 'Argo CD']
    },
    {
      category: 'CI/CD & Version Control',
      icon: <GitBranch className="w-5 h-5" />,
      items: ['Jenkins', 'GitHub Actions', 'GitHub', 'Bitbucket', 'Azure Repos']
    },
    {
      category: 'IaC & Scripting',
      icon: <Code2 className="w-5 h-5" />,
      items: ['Terraform', 'PowerShell', 'Groovy', 'YAML', 'Shell Scripting']
    },
    {
      category: 'Data & Messaging',
      icon: <Database className="w-5 h-5" />,
      items: ['Kafka', 'PostgreSQL', 'MongoDB', 'Elasticsearch']
    },
    {
      category: 'Monitoring & Tools',
      icon: <Wrench className="w-5 h-5" />,
      items: ['ELK Stack', 'Prometheus', 'Grafana', 'CloudWatch', 'Dynatrace']
    }
  ],
  experience: [
    {
      role: 'Lead Engineer - Site Reliability',
      company: 'Freshworks',
      duration: 'April 2025 - Present',
      location: 'Chennai, Tamil Nadu',
      responsibilities: [
        'Managed infrastructure as code using Terraform, ensuring consistency across environments by leveraging reusable modules, remote state management, and automated CI/CD pipelines for infrastructure deployment using GitHub Actions.',
        'Implemented Kubernetes security best practices including RBAC, service accounts, and least-privilege access to restrict unauthorized actions within clusters.',
        'Protected sensitive data by managing credentials and configuration with Kubernetes Secrets, integrated with external secret stores (AWS Secrets Manager).',
        'Improved compliance & visibility through admission controllers (Gatekeeper), image vulnerability scanning, and automated security audits aligned with CIS Kubernetes benchmarks.',
        'Collaborated as part of the central Kafka team, enabling all Freshworks product teams to reliably use the Kafka platform at scale.',
        'Led the migration of Kafka infrastructure from EC2 instances to a Strimzi Operator–managed Kafka deployment on Amazon EKS, ensuring high availability and scalability.',
        'Owned and optimized Kafka MirrorMaker 2 configurations to achieve seamless data replication and smooth migration with minimal downtime.',
        'Provided 24/7 on-call production support, resolving P0/P1 incidents within SLA and ensuring uninterrupted data streaming for business-critical applications.'
      ]
    },
    {
      role: 'Senior Consultant - DevOps Lead',
      company: 'EY Global Delivery Service LLP',
      duration: 'September 2020 - April 2025',
      location: 'Chennai, Tamil Nadu',
      responsibilities: [
        'Configured a Jenkins cluster from scratch and implemented a distributed build system using slaves and parallel builds, reducing build times by 50%.',
        'Successfully optimized AWS infrastructure and resource utilization, reducing overall cloud costs by 30% for a key client through strategic use of services, automation, and monitoring.',
        'Implemented advanced security measures within containers, making applications highly resilient to unauthorized access and tampering during runtime.',
        'Introduced Terraform to automate infrastructure setup, significantly reducing manual effort and minimizing human errors.',
        'Created and managed AWS EKS clusters, including setup of CloudFront CDN for efficient content delivery and configuration of Application Load Balancers (ALBs).',
        'Developed, maintained, and deployed Kubernetes pods and services, configured AWS Ingress controllers, and managed configuration resources.',
        'Implemented Dynatrace integration with AWS EKS and Lambda functions to provide end-to-end monitoring and observability.',
        'Utilized CI/CD services to deploy applications to SAP Business Technology Platform (BTP), integrated with S/4HANA system via Cloud Connector.',
        'Recognized as Subject Matter Expert (SME) in AWS, SAP BTP, and DevOps practices, serving as primary resource for technical inquiries.',
        'Led a team of 10 professionals, overseeing development and performance while managing DevOps projects.',
        'Published several Points of View (POVs) on business benefits of SAP Kyma, Docker usage, and DevOps in SAP BTP.',
        'Secured cluster networking by implementing Istio service mesh policies to enforce micro-segmentation and zero-trust principles.'
      ]
    },
    {
      role: 'Senior Software Engineer - Backend Lead',
      company: 'Guidanz Inc',
      duration: 'July 2016 - September 2020',
      location: 'Chennai, Tamil Nadu',
      responsibilities: [
        'Developed and implemented RESTful APIs and Websockets to facilitate efficient communication between front-end and back-end systems.',
        'Worked closely with cross-functional teams to gather requirements, design solutions, and deliver high-quality software.',
        'Implemented authentication and authorization mechanisms using JWT, OAuth, and SSO to secure applications.',
        'Conducted regular security audits to identify and address vulnerabilities, ensuring robust protection of sensitive data.',
        'Containerized applications using Docker and published to Docker Hub, providing customers with streamlined deployment solutions.',
        'Deployed and utilized the ELK stack (Elasticsearch, Logstash, and Kibana) for comprehensive logging and monitoring.',
        'Led team in migrating Node.js application from Node.js 6 to Node.js 12, ensuring compatibility and improving performance.',
        'Managed a team of 5 developers, guiding project execution and ensuring delivery of high-quality software solutions.'
      ]
    }
  ],
  blogs: [
    {
      id: '1',
      title: 'Kubernetes Security Best Practices in 2025',
      excerpt: 'Exploring RBAC, service accounts, and least-privilege access patterns to secure your Kubernetes clusters. Learn how to implement admission controllers and automated security audits.',
      content: '# Kubernetes Security Best Practices in 2025\n\n![Kubernetes Security](https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?w=800)\n\nKubernetes has become the de facto standard for container orchestration...\n\n## RBAC and Service Accounts\n\nImplementing proper RBAC is crucial...\n\n## Admission Controllers\n\nUsing tools like Gatekeeper...',
      date: 'January 15, 2025',
      author: 'Guru Prasanth E',
      imageUrl: 'https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?w=800'
    },
    {
      id: '2',
      title: 'Migrating Kafka to EKS with Strimzi Operator',
      excerpt: 'A comprehensive guide to migrating Kafka infrastructure from EC2 to Amazon EKS using the Strimzi Operator, ensuring high availability and minimal downtime.',
      content: '# Migrating Kafka to EKS with Strimzi Operator\n\n![Kafka Migration](https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800)\n\nIn this post, I share our experience migrating Kafka infrastructure...\n\n## Planning the Migration\n\nThe first step was thorough planning...',
      date: 'December 28, 2024',
      author: 'Guru Prasanth E',
      imageUrl: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800'
    },
    {
      id: '3',
      title: 'Infrastructure as Code: Terraform Best Practices',
      excerpt: 'Lessons learned from managing multi-environment infrastructure with Terraform. Discover patterns for reusable modules, remote state management, and CI/CD integration.',
      content: '# Infrastructure as Code: Terraform Best Practices\n\n![Terraform](https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800)\n\nTerraform has revolutionized infrastructure management...\n\n## Reusable Modules\n\nCreating reusable modules is key...',
      date: 'November 10, 2024',
      author: 'Guru Prasanth E',
      imageUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800'
    },
    {
      id: '4',
      title: 'Building Resilient Systems: SRE Principles',
      excerpt: 'Deep dive into Site Reliability Engineering principles and how to apply them in production environments for maximum uptime and reliability.',
      content: '# Building Resilient Systems: SRE Principles\n\n![SRE](https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800)\n\nSite Reliability Engineering is more than just operations...\n\n## Error Budgets\n\nError budgets help balance innovation...',
      date: 'October 5, 2024',
      author: 'Guru Prasanth E',
      imageUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800'
    }
  ]
};