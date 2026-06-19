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
        "Lead the reliability, availability, and operational excellence of cloud-native platforms running on Amazon EKS, maintaining 99.9%+ service availability for business-critical production workloads.",
        "Architect and manage Infrastructure as Code (IaC) using Terraform, developing reusable modules and automated deployment workflows that significantly reduced manual provisioning efforts and improved infrastructure consistency across environments.",
        "Drive GitOps-based deployment strategies using Argo CD and GitHub Actions, enabling secure, auditable, and automated application releases while reducing deployment risk and operational overhead.",
        "Design and operate observability platforms using Prometheus, Grafana, and centralized logging solutions, improving visibility into application performance, infrastructure health, and service reliability.",
        "Implement proactive monitoring and alerting mechanisms that reduce Mean Time to Detect (MTTD) and accelerate incident response for critical production services.",
        "Own 24x7 production support and on-call operations, leading incident management for P0/P1 outages, resolving issues within SLA commitments, and driving root cause analysis to prevent recurrence.",
        "Develop automation solutions, operational tooling, and self-service capabilities that improve engineering productivity, reduce manual intervention, and enhance platform reliability.",
        "Implement Kubernetes security best practices, including RBAC, service accounts, admission controllers, and least-privilege access models, to strengthen cluster security and governance.",
        "Secure sensitive application data through integration with AWS Secrets Manager and Kubernetes Secrets, ensuring compliance with organizational security and operational standards.",
        "Improve platform compliance and governance through policy enforcement using Gatekeeper, image vulnerability scanning, and automated security audits aligned with CIS Kubernetes benchmarks.",
        "Partner with development, platform, networking, and security teams to improve deployment stability, operational readiness, scalability, and overall service resilience.",
        "Led the migration of distributed messaging infrastructure from EC2-based deployments to a Kubernetes native architecture using Strimzi on Amazon EKS, improving scalability, operational efficiency, and platform resiliency while ensuring zero customer-impacting downtime during migration activities.",
        "Led Kafka platform modernization and migration initiatives on Amazon EKS, utilizing Cruise Control to automate partition rebalancing, optimize broker utilization, and maintain cluster balance during infrastructure changes while ensuring high availability and minimal service disruption.",
        "Contributed to capacity planning, performance optimization, and infrastructure scaling strategies, ensuring platform readiness to support growing business and application demands"
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
