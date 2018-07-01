//引入在打包时能够自动生成html模块
const HtmlWebpackPlugin = require("html-webpack-plugin");
//引入在打包时把css单独分离出来模块
const ExtractTextPlugin = require("extract-text-webpack-plugin");
//引入在打包时把旧文件删除模块
const CleanWebpackPlugin = require("clean-webpack-plugin");

//引入path模块
const path = require("path");

//是使用node.js来跑这个文件并导出此对象
module.exports = {
    entry:"./src/app.js",//程序的入口、项目入口文件，并输出新的文件
    output:{//设置输出的新文件存放位置
        path:path.resolve(__dirname,"dist"),//新文件存放的位置

        filename:"common/js/main.js",//新js文件的命名

        publicPath: "/"//所有资源的基础路径，而且一定是 / 结尾

    },
    plugins:[//打包时自动生成html

        //打包时把旧文件删除
        new CleanWebpackPlugin(["dist"]),

        new HtmlWebpackPlugin({
            filename:"index.html",//套用某个html后的新html
            template:"src/index.html"//指定套用的html
        }),

        new ExtractTextPlugin("common/style/style.css"),//导出css并命名,且使用link引入
    ],
    module:{//配置loader要处理的文件
        rules:[
            {
            test:/\.js$/,//有很多js文件名，配置只要是js后缀名就进行处理
            use:[{
                loader:"babel-loader"//处理src下app.js里面的内容
            }],
            exclude:[
                path.resolve(__dirname,"node_modules")
            ]
        },
            //配置只要是css后缀名就进行处理
        {
            test:/\.css$/,
            use: ExtractTextPlugin.extract({
                fallback: "style-loader",
                use:[{
                    loader:"css-loader",
                    options:{
                        url:true,
                        minimize:true,
                        sourceMap:true
                    }
                }]
            })
        },
        //配置处理图片loader
        {
            test:/\.(jpg|png|gif|jpeg)$/,
            use:[{
                loader:"url-loader",
                options:{
                    limit:20,
                    name:"common/images/[name]_[hash:1].[ext]"
                }
            }]
        },
        ///配置css3字体只要是css3字体后缀名就进行处理
        {
            test:/\.(ttf|svg|eot|woff|woff2)$/,
            use:[{
                loader:"file-loader",
                options:{
                    name:"common/fonts/[name]_[hash:2].[ext]"
                }
            }]
        }
        ]
    },
    devServer: {//webpack服务器配置
        open:true,//自动打开浏览器
        port:58088,//设置监听某个端口
        publicPath:"/"
    }
};