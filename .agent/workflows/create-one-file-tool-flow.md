---
description: 根据用户的需求输入构建单文件的tool
---

0. 根据用户输入的需求，提炼核心关键词，创建对应英文命名的文件夹，单词之间使用`-`进行分隔，后续生成的所有文件都输出到该文件夹内
1. 根据用户粗糙的需求描述，调用 product-manager rule 生成一篇专业完整的 prd 文档
2. 接着基于上一步骤生成的 prd 文档，调用 ui-design-master rule 生成一份专业完整的 设计实现说明文档
3. 基于上两步中生成的 prd 文档和设计实现说明文档， 调用 single-html-file-tool rule 完成编码工作，实现所有的功能和设计
4. 然后 调用 generate-tool-doc rule 生成对应的描述文档
5. 最后将实现的工具站点集成到 index.html 文件中