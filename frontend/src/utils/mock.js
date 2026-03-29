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
      location: 'Chennai, Tamil Nadu'
    },
    {
      role: 'Senior Consultant - DevOps Lead',
      company: 'EY Global Delivery Service LLP',
      duration: 'September 2020 - April 2025',
      location: 'Chennai, Tamil Nadu'
    },
    {
      role: 'Senior Software Engineer - Backend Lead',
      company: 'Guidanz Inc',
      duration: 'July 2016 - September 2020',
      location: 'Chennai, Tamil Nadu'
    }
  ],
  education: [
    {
      degree: 'Master of Computer Applications',
      field: 'Computer Science',
      institution: 'Loyola College, Chennai',
      year: 'Graduated May 2016'
    },
    {
      degree: 'Bachelor of Science',
      field: 'Mathematics',
      institution: 'Loyola College, Chennai',
      year: 'Graduated May 2013'
    }
  ],
  blogs: [
    {
      id: '1',
      title: 'Kubernetes Security Best Practices in 2025',
      excerpt: 'Exploring RBAC, service accounts, and least-privilege access patterns to secure your Kubernetes clusters. Learn how to implement admission controllers and automated security audits.',
      content: '# Kubernetes Security Best Practices in 2025\n\nKubernetes has become the de facto standard for container orchestration...\n\n## RBAC and Service Accounts\n\nImplementing proper RBAC is crucial...\n\n## Admission Controllers\n\nUsing tools like Gatekeeper...',
      date: 'January 15, 2025',
      author: 'Guru Prasanth E'
    },
    {
      id: '2',
      title: 'Migrating Kafka to EKS with Strimzi Operator',
      excerpt: 'A comprehensive guide to migrating Kafka infrastructure from EC2 to Amazon EKS using the Strimzi Operator, ensuring high availability and minimal downtime.',
      content: '# Migrating Kafka to EKS with Strimzi Operator\n\nIn this post, I share our experience migrating Kafka infrastructure...\n\n## Planning the Migration\n\nThe first step was thorough planning...',
      date: 'December 28, 2024',
      author: 'Guru Prasanth E'
    },
    {
      id: '3',
      title: 'Infrastructure as Code: Terraform Best Practices',
      excerpt: 'Lessons learned from managing multi-environment infrastructure with Terraform. Discover patterns for reusable modules, remote state management, and CI/CD integration.',
      content: '# Infrastructure as Code: Terraform Best Practices\n\nTerraform has revolutionized infrastructure management...\n\n## Reusable Modules\n\nCreating reusable modules is key...',
      date: 'November 10, 2024',
      author: 'Guru Prasanth E'
    },
    {
      id: '4',
      title: 'Building Resilient Systems: SRE Principles',
      excerpt: 'Deep dive into Site Reliability Engineering principles and how to apply them in production environments for maximum uptime and reliability.',
      content: '# Building Resilient Systems: SRE Principles\n\nSite Reliability Engineering is more than just operations...\n\n## Error Budgets\n\nError budgets help balance innovation...',
      date: 'October 5, 2024',
      author: 'Guru Prasanth E'
    }
  ]
};