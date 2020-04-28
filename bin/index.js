#! /usr/bin/env node

// 使用Node开发命令行工具所执行JavaScript脚本必须在顶部加入 #! /usr/bin/env node

const { program } = require('commander');
const download = require('download-git-repo');
const handlebars = require('handlebars');
const inquirer = require('inquirer');
const ora = require('ora');
const logSymbols = require('log-symbols');
const chalk = require('chalk');
const fs = require('fs');

const templates = {
  'template-A' : {
    url: 'https://github.com/dongtaotao/template-A',
    downloadUrl: 'http://github.com:dongtaotao/template-A#master',
    description: 'A模版'
  },
  'template-B' : {
    url: 'https://github.com/dongtaotao/template-B',
    downloadUrl: 'http://github.com:dongtaotao/template-B#master',
    description: 'B模版'
  },
  'template-C' : {
    url: 'https://github.com/dongtaotao/template-C',
    downloadUrl: 'http://github.com:dongtaotao/template-C#master',
    description: 'C模版'
  },
};

//qiyitest init template-A a-name基于template-A模版进行初始化
//qiyitest init template-B a-name基于template-A模版进行初始化

program.version('1.0.0') // -v 或者 --versions输出版本号

program
  .command('init <template> <project>')
  .description('初始化项目模版')
  .action((templateName, projectName) => {
    // 下载之前做loading提示
    const spinner = ora('正在下载模版...').start()
    
    const {downloadUrl} = templates[templateName];
    //download 
    // 第一个参数： 仓库地址
    // 第二个参数： 下载路径
    download(downloadUrl, projectName, {clone: true}, (err) => {
      if(err) {
        spinner.fail();
        console.log(logSymbols.error, chalk.red(err))
        return;
      }
      spinner.succeed(); // 下载成功提示
      // 把项目下的package.json文件读取出来
      // 使用向导的方式采集用户输入的数据解析导
      // 使用模板引擎把用户输入的数据解析到package.json 文件中
      // 解析完毕，把解析之后的结果重新写入package.json wenjianzhong 
      inquirer.prompt([
        {
          type: 'inpute',
          name: 'name',
          message: '请输入项目名称'
        },
        {
          type: 'inpute',
          name: 'description',
          message: '请输入项目简介'
        },
        {
          type: 'inpute',
          name: 'author',
          message: '请输入作者名称'
        }
    ]).then((answers) => {
      const packagePath = `${projectName}/package.json`
      const packageContent = fs.readFileSync(packagePath, 'utf8')
      const packageResult = handlebars.compile(packageContent)(answers);
      fs.writeFileSync(packagePath, packageResult)
      console.log(chalk.yellow('初始化模版成功'))
    })

    })
  })

program
  .command('list')
  .description('查看所有可用的模版')
  .action(() => {
    console.log(
      `template-A A模板
      template-B B模板
      template-C C模板`
     
    )
  })

program.parse(process.argv);