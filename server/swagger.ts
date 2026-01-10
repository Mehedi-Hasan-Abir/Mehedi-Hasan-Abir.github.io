import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Modern Portfolio API',
      version: '1.0.0',
      description: 'API documentation for Mehedi Hasan\'s AI/ML Engineer Portfolio',
      contact: {
        name: 'Mehedi Hasan',
        email: 'abir.aust.102@gmail.com',
        url: 'https://github.com/Mehedi-Hasan-Abir'
      },
      license: {
        name: 'MIT',
        url: 'https://opensource.org/licenses/MIT'
      }
    },
    servers: [
      {
        url: 'http://localhost:5000',
        description: 'Development server'
      },
      {
        url: 'https://mehedi-hasan-abir.github.io',
        description: 'Production server (GitHub Pages)'
      }
    ],
    components: {
      schemas: {
        PersonalInfo: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 1 },
            name: { type: 'string', example: 'Mehedi Hasan' },
            role: { type: 'string', example: 'AI/ML Engineer' },
            bio: { type: 'string', example: 'Passionate AI Engineer...' },
            email: { type: 'string', example: 'abir.aust.102@gmail.com' },
            phone: { type: 'string', example: '(+880) 1521323549' },
            github: { type: 'string', example: 'https://github.com/Mehedi-Hasan-Abir' },
            linkedin: { type: 'string', example: 'https://linkedin.com/in/mehedihasan102' },
            location: { type: 'string', example: 'Dhaka, Bangladesh' },
            avatarUrl: { type: 'string', example: '/images/profile.jpg' },
            resumeUrl: { type: 'string', example: '/images/resume.pdf' }
          }
        },
        Experience: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 1 },
            title: { type: 'string', example: 'Senior Software Engineer' },
            company: { type: 'string', example: 'Technonext' },
            period: { type: 'string', example: 'Jun 2025 – Present' },
            description: { 
              type: 'array', 
              items: { type: 'string' },
              example: ['Working on Ticket Parsing...', 'Built LLM-powered pipeline...']
            }
          }
        },
        Project: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 1 },
            title: { type: 'string', example: 'Shorol Notes' },
            description: { type: 'string', example: 'AI-Powered Note-Taking...' },
            techStack: { 
              type: 'array', 
              items: { type: 'string' },
              example: ['React', 'TypeScript', 'Node.js']
            },
            link: { type: 'string', example: 'https://github.com/...' }
          }
        },
        Skill: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 1 },
            category: { type: 'string', example: 'Programming' },
            items: { 
              type: 'array', 
              items: { type: 'string' },
              example: ['Python', 'JavaScript', 'TypeScript']
            }
          }
        },
        Blog: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 1 },
            title: { type: 'string', example: 'Building AI-Powered Document Understanding Systems' },
            description: { type: 'string', example: 'A comprehensive guide...' },
            thumbnail: { type: 'string', example: '/images/blog-document-ai.jpg' },
            externalLink: { type: 'string', example: 'https://medium.com/...' },
            platform: { type: 'string', example: 'Medium' },
            date: { type: 'string', example: '2024-12-15' },
            tags: { 
              type: 'array', 
              items: { type: 'string' },
              example: ['AI', 'Document AI', 'Machine Learning']
            }
          }
        }
      }
    }
  },
  apis: ['./server/routes.ts'], // Path to the API routes
};

const specs = swaggerJsdoc(options);

export { specs, swaggerUi };