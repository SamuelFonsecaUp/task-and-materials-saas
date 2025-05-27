
# Guia de Contribuição

Obrigado por considerar contribuir com o Task and Materials SaaS! Este documento fornece diretrizes para contribuições.

## Como contribuir

### Reportando bugs

1. Verifique se o bug já foi reportado nos [Issues](https://github.com/[seu-usuario]/task-and-materials-saas/issues)
2. Se não foi reportado, crie um novo issue com:
   - Título claro e descritivo
   - Passos para reproduzir o bug
   - Comportamento esperado vs comportamento atual
   - Screenshots (se aplicável)
   - Informações do ambiente (navegador, OS)

### Sugerindo melhorias

1. Verifique se a sugestão já foi feita
2. Crie um issue com:
   - Título claro
   - Descrição detalhada da melhoria
   - Justificativa para a mudança
   - Possível implementação (se aplicável)

### Contribuindo com código

1. **Fork** o repositório
2. **Clone** seu fork localmente
3. **Crie uma branch** para sua feature/correção
4. **Faça suas alterações** seguindo os padrões do projeto
5. **Teste** suas alterações
6. **Commit** com mensagens claras
7. **Push** para sua branch
8. **Abra um Pull Request**

## Padrões de desenvolvimento

### Estrutura de commits

Use o padrão [Conventional Commits](https://www.conventionalcommits.org/):

```
type(scope): description

feat(tasks): adiciona filtro por status
fix(auth): corrige erro de logout
docs(readme): atualiza instruções de instalação
refactor(components): reorganiza estrutura de pastas
```

### Padrões de código

- **TypeScript**: Todo código deve ser tipado
- **ESLint**: Siga as regras configuradas
- **Componentes**: Mantenha-os pequenos e focados
- **Hooks**: Extraia lógica reutilizável para hooks customizados
- **Nomes**: Use nomes descritivos para variáveis e funções

### Estrutura de componentes

```tsx
// Imports
import React from 'react';
import { ComponentProps } from './types';

// Interface/Types (se necessário)
interface MyComponentProps {
  title: string;
  onAction: () => void;
}

// Componente
export const MyComponent = ({ title, onAction }: MyComponentProps) => {
  // Hooks e estado

  // Handlers

  // Render
  return (
    <div>
      {/* JSX */}
    </div>
  );
};

// Export default (se necessário)
export default MyComponent;
```

### Testes (quando implementados)

- Teste componentes com React Testing Library
- Teste hooks customizados
- Teste funções utilitárias
- Mantenha cobertura de teste adequada

## Configuração do ambiente

Siga as instruções no [README.md](README.md) para configurar o ambiente de desenvolvimento.

## Processo de review

1. **Automated checks**: CI/CD deve passar
2. **Code review**: Pelo menos um mantainer deve aprovar
3. **Testing**: Funcionalidade deve ser testada
4. **Documentation**: Atualize documentação se necessário

## Dúvidas?

Se tiver dúvidas sobre como contribuir:

1. Verifique a documentação existente
2. Procure em issues fechados
3. Abra uma discussão no GitHub
4. Entre em contato com os mantainers

## Código de Conduta

- Seja respeitoso e inclusivo
- Foque no problema, não na pessoa
- Aceite feedback construtivo
- Ajude outros contribuidores

Obrigado por contribuir! 🚀
