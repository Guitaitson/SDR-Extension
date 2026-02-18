# LGPD — Legítimo Interesse (LIA — Legitimate Interest Assessment)

**Documento:** Teste de Balanceamento para Prospecção B2B
**Versão:** 1.0
**Data:** 2026-02
**Referência:** LGPD Art. 7º, IX; Guia Orientativo ANPD 2024

---

## 1. Identificação do Operador

- **Produto:** SDR Extension (Extensão Chrome para Prospecção B2B)
- **Tratamento:** Consulta a dados públicos de CNPJ e geração de mensagens de prospecção

---

## 2. Finalidade do Tratamento

**Finalidade primária:** Auxiliar profissionais de vendas B2B (SDRs) a obter informações sobre empresas-alvo para contato comercial legítimo.

**Finalidade secundária:** Gerar mensagens personalizadas de prospecção baseadas em dados públicos da empresa.

---

## 3. Dados Tratados

### Dados de Pessoa Jurídica (NÃO são dados pessoais)

Os dados abaixo são públicos, disponibilizados pela Receita Federal via Lei de Acesso à Informação (Lei nº 12.527/2011) e **não são protegidos pela LGPD**:

- CNPJ, Razão Social, Nome Fantasia
- CNAE (Código de Atividade Econômica)
- Porte da empresa
- Capital Social
- Endereço da sede
- Situação Cadastral
- Data de Abertura

### Dados de Pessoa Natural — ATENÇÃO LGPD

Os dados abaixo são **dados pessoais** nos termos da LGPD e recebem tratamento diferenciado:

| Dado | Contexto | Base Legal |
|------|----------|------------|
| Nome de sócio (CNPJ) | Publicado pela RF, contexto empresarial | Legítimo Interesse |
| CPF de sócio (CNPJ) | Publicado pela RF | **NÃO armazenado** |
| MEI / EI — todos os dados | Pessoa física com CNPJ | Legítimo Interesse c/ opt-out |
| E-mail de funcionário | Enriquecimento via Apollo/Lusha (BYOK) | Legítimo Interesse |

---

## 4. Teste de Balanceamento (Three-Part Test)

### Parte 1 — Finalidade Legítima

A prospecção B2B é uma prática comercial estabelecida e necessária para o funcionamento de mercados. O contato entre empresas para oferta de produtos e serviços é inerente à atividade econômica.

**Conclusão:** Finalidade legítima ✓

### Parte 2 — Necessidade

A extensão:
- Usa **exclusivamente dados já públicos** (Receita Federal)
- **Não armazena dados pessoais** além do necessário para o serviço (apenas e-mail do usuário para auth)
- **Não rastreia** comportamento dos prospects
- O BYOK para Apollo/Lusha é uma **escolha ativa e informada** do usuário

**Conclusão:** Necessidade demonstrada ✓

### Parte 3 — Balanceamento e Salvaguardas

| Fator | Avaliação |
|-------|-----------|
| Expectativa do titular | Profissionais e empresas registradas na RF esperam ser contactados comercialmente |
| Impacto ao titular | Baixo — contato comercial B2B, não invasivo |
| Natureza dos dados | Dados empresariais públicos; dados pessoais mínimos |
| Salvaguardas | Opt-out obrigatório; sem armazenamento de PII; sem scraping de redes sociais |

**Conclusão:** Interesses do operador prevalecem com salvaguardas ✓

---

## 5. Salvaguardas Implementadas

1. **Opt-out:** Qualquer pessoa pode solicitar remoção via suporte — resposta em 48h
2. **Dados mínimos:** Nenhum dado pessoal é armazenado além do e-mail de auth
3. **Cache sem PII:** O cache de CNPJ armazena apenas dados empresariais públicos
4. **Flag MEI/EI:** A extensão sinaliza visualmente quando a empresa é MEI/EI (dados pessoais)
5. **Sem LinkedIn:** A extensão não coleta dados de perfis pessoais
6. **Transparência:** Política de Privacidade clara com bases legais listadas
7. **BYOK como escolha:** Enriquecimento com dados pessoais (Apollo/Lusha) é opt-in e usa a chave do próprio usuário

---

## 6. Categorias Excluídas do Tratamento

A extensão **não trata e não deve tratar**:
- Dados de saúde, biométricos ou sensíveis (Art. 5º, II)
- Dados de menores (Art. 14)
- Dados obtidos por scraping não autorizado
- Dados de pessoas que optaram por não ser prospectadas

---

## 7. Revisão

Este documento deve ser revisado:
- Anualmente
- Sempre que o escopo do tratamento mudar
- Após publicação de nova orientação da ANPD sobre legítimo interesse

**Referências:**
- LGPD (Lei nº 13.709/2018), especialmente Art. 7º, IX; Art. 10; Art. 17
- Guia Orientativo ANPD — Legítimo Interesse (2024)
- Resolução ANPD CD/ANPD nº 15/2024
