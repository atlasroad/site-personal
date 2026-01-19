# Implementation Plan: Site Optimization

## Overview

Este plano implementa otimizações de vendas e SEO para um site React/Next.js, priorizando a correção do componente FloatingWhatsapp, melhorias de conversão e implementação de SEO técnico. Cada tarefa constrói incrementalmente sobre as anteriores, garantindo integração completa.

## Tasks

- [ ] 1. Corrigir FloatingWhatsapp Component
  - [x] 1.1 Substituir implementação atual do FloatingWhatsapp.tsx
    - Implementar layout Flexbox corrigido conforme código fornecido pelo usuário
    - Corrigir alinhamento do tooltip e compressão de texto
    - Garantir responsividade em diferentes tamanhos de tela
    - _Requirements: 1.1, 1.2, 1.3, 1.4_
  
  - [x] 1.2 Escrever teste de propriedade para layout do FloatingWhatsapp
    - **Property 1: FloatingWhatsapp Layout Consistency**
    - **Validates: Requirements 1.1, 1.2, 1.3**
  
  - [x] 1.3 Escrever teste de propriedade para feedback interativo
    - **Property 2: Interactive Feedback Consistency**
    - **Validates: Requirements 1.5**
  
  - [x] 1.4 Escrever testes unitários para casos extremos
    - Testar números de telefone inválidos
    - Testar textos muito longos no tooltip
    - Testar comportamento em telas muito pequenas
    - _Requirements: 1.1, 1.2, 1.3, 1.5_

- [x] 2. Checkpoint - Verificar FloatingWhatsapp
  - Garantir que todos os testes passem, perguntar ao usuário se há dúvidas

- [ ] 3. Implementar otimizações de SEO
  - [x] 3.1 Configurar Metadata API do Next.js 13+
    - Criar arquivo lib/seo.ts com utilitários SEO
    - Implementar interfaces para SEOMetadata e OpenGraphData
    - Configurar metadata padrão no layout.tsx
    - _Requirements: 3.1_
  
  - [x] 3.2 Implementar dados estruturados (Schema.org)
    - Adicionar JSON-LD para Organization e Website
    - Criar componente para injeção de structured data
    - _Requirements: 3.1_
  
  - [x] 3.3 Escrever teste de propriedade para completude de metadata SEO
    - **Property 4: SEO Metadata Completeness**
    - **Validates: Requirements 3.1**
  
  - [x] 3.4 Otimizar hierarquia de cabeçalhos
    - Auditar e corrigir estrutura H1/H2/H3 em todas as páginas
    - Implementar componente Heading com validação automática
    - _Requirements: 3.2_
  
  - [x] 3.5 Escrever teste de propriedade para hierarquia de cabeçalhos
    - **Property 5: Heading Hierarchy Compliance**
    - **Validates: Requirements 3.2**
  
  - [x] 3.6 Implementar otimização de imagens
    - Adicionar alt texts apropriados para todas as imagens
    - Configurar otimização automática de tamanhos
    - Implementar lazy loading onde apropriado
    - _Requirements: 3.3_
  
  - [x] 3.7 Escrever teste de propriedade para acessibilidade de imagens
    - **Property 6: Image Accessibility Compliance**
    - **Validates: Requirements 3.3**

- [ ] 4. Implementar SEO técnico
  - [x] 4.1 Configurar sitemap.xml automático
    - Implementar geração dinâmica de sitemap
    - Configurar robots.txt otimizado
    - _Requirements: 3.4_
  
  - [x] 4.2 Otimizar URLs e roteamento
    - Garantir URLs SEO-friendly
    - Implementar canonical tags onde necessário
    - _Requirements: 3.4_
  
  - [x] 4.3 Escrever teste de propriedade para SEO técnico
    - **Property 7: Technical SEO Implementation**
    - **Validates: Requirements 3.4**

- [x] 5. Checkpoint - Verificar implementação SEO
  - Garantir que todos os testes passem, perguntar ao usuário se há dúvidas

- [ ] 6. Implementar otimizações de conversão
  - [x] 6.1 Otimizar componentes de Call-to-Action
    - Criar componente CTAButton reutilizável
    - Implementar variantes (primary, secondary, urgent)
    - Adicionar tracking de conversão
    - _Requirements: 2.1, 2.2_
  
  - [x] 6.2 Implementar elementos de prova social
    - Criar componente SocialProof para testimonials
    - Otimizar apresentação de credenciais e certificações
    - _Requirements: 2.3_
  
  - [x] 6.3 Otimizar formulários de contato
    - Simplificar validação de formulários
    - Implementar feedback visual claro para erros
    - Reduzir campos obrigatórios ao mínimo
    - _Requirements: 2.5_
  
  - [x] 6.4 Escrever teste de propriedade para redução de fricção
    - **Property 3: Form Friction Minimization**
    - **Validates: Requirements 2.5**
  
  - [x] 6.5 Escrever testes unitários para componentes de conversão
    - Testar diferentes variantes de CTA
    - Testar validação de formulários
    - Testar tracking de eventos
    - _Requirements: 2.1, 2.2, 2.5_

- [ ] 7. Implementar analytics e tracking
  - [x] 7.1 Configurar tracking de conversão
    - Implementar lib/analytics.ts
    - Adicionar eventos de conversão em CTAs
    - Configurar Google Analytics 4 ou similar
    - _Requirements: 2.4_
  
  - [x] 7.2 Implementar monitoramento de performance
    - Adicionar Core Web Vitals tracking
    - Configurar alertas para métricas SEO
    - _Requirements: 3.5_

- [ ] 8. Integração e testes finais
  - [x] 8.1 Integrar todos os componentes
    - Conectar FloatingWhatsapp otimizado
    - Integrar CTAs otimizados nas páginas principais
    - Verificar funcionamento do SEO em todas as páginas
    - _Requirements: 1.1-1.5, 2.1-2.5, 3.1-3.5_
  
  - [x] 8.2 Executar suite completa de testes
    - Executar todos os testes de propriedade
    - Executar todos os testes unitários
    - Verificar cobertura de testes
    - _Requirements: Todas_

- [x] 9. Checkpoint final - Verificar otimização completa
  - Garantir que todos os testes passem, verificar métricas de performance, perguntar ao usuário se há dúvidas

## Notes

- Todas as tarefas são obrigatórias para implementação abrangente desde o início
- Cada tarefa referencia requisitos específicos para rastreabilidade
- Checkpoints garantem validação incremental
- Testes de propriedade validam propriedades universais de correção
- Testes unitários validam exemplos específicos e casos extremos
- A Tarefa 1.1 deve usar o código corrigido já fornecido pelo usuário