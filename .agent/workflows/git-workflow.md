---
description: git commit and push flow
---

当收到用户的指令后，先按照generate-tool-doc rule创建对应新增html文件的.md文档，然后根据impact-analysis rule梳理当前的影响范围，最后生成提交git的commit message,然后唤起终端命令行，执行git add --all 和 git commit 命令，最后执行git push 命令提交到remote