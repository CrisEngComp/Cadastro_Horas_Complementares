
# Cadastro de Horas Complementares

O sistema de lançamento de horas complementares para o curso de Engenharia da Computação da UEMG Divinópoli tem como objetivo auxiliar no gerenciamento e cálculo das horas complementares de acordo com as regras do Projeto Pedagógico do Curso (PPC) aprovado no ano de 2021. O sistema possui as seguintes funcionalidades:

Entrada de Dados:

- Recebe as seguintes informações:
  - Descrição da atividade.
  - Categoria da atividade (Ensino, Extensão e Pesquisa).
  - Tipo específico da atividade (como Projeto de Extensão, Atividades Culturais, Visitas Técnicas, Visitas a Feiras e Exposições).
  - Total de horas da atividade.

Cálculo e Validação:

- Calcula o total de horas aproveitadas para a atividade específica, considerando as regras do PPC.
- Calcula o total de horas acumuladas para cada tipo de atividade dentro de cada categoria.
- Verifica a limitação de 90 horas por categoria, conforme estabelecido no PPC.

Visualização de Dados:

- Exibe duas tabelas:
  - A primeira mostra as informações cadastradas e os cálculos realizados para cada atividade.
  - A segunda apresenta um resumo das categorias com o total de horas acumuladas em cada uma.

Integração com o banco de dados NoSQL Firebase:

- Os registros das atividades são salvos no banco de dados Firebase.
- Possui a opção de exportar os registros cadastrados em um arquivo Excel para facilitar a documentação e consulta das horas complementares.

