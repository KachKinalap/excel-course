// мы импортировали в переменную объект path
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyPlugin = require('copy-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const ESLintPlugin = require('eslint-webpack-plugin')


module.exports = (env, argv) => {
  // проверка на стиль работы - продакшн или разработка
  const isProd = argv.mode === 'production';
  const isDev = !isProd;

  const filename = (ext)=> isProd ? `[name].[contenthash].bundle.${ext}` : `[name].bundle.${ext}`;

  const plugins = () => {
    const base = [
      new HtmlWebpackPlugin({
        template: './index.html'
      }),
      new CopyPlugin({
        patterns: [
          {from: path.resolve(__dirname, 'src', 'favicon.ico'),
            to: path.resolve(__dirname, 'dist')
          },

        ],
      }),
      new MiniCssExtractPlugin({
        filename: filename('css'),
      })

    ]

    if (isDev) {
      // несмотря на const при объявлении base, мы всёё равно можем добавить туда элементы через const, вот так, ребятки
      base.push(new ESLintPlugin());
    }
    return base;
  }

  return {
    target: 'web',
    context: path.resolve(__dirname, 'src'), // заебашили с помощью модуля полный путь до папки src, чтобы не прописывать вручную хы
    // мы в качестве контекста указали папку src, так что теперь можем писать относительный путь
    // указываем входную точку
    entry: {
      main: [
        'core-js/stable',
        'regenerator-runtime/runtime',
        './index.js'
      ]
    },
    // теперь указываем, куда будут генериться файлы
    output: {
      path: path.resolve(__dirname, 'dist'),
      // сделаем универсально, пропишем в квадратных скобках name, чтобы из main имя подставлялось автоматом
      filename: filename('js'),
      clean: true,
    },
    resolve: {
      // делаем для того,чтобы сократить путь к файлу, теперь у файлов можно не писать расширение, webpack будет искать автоматом файлы с расширением .js
      extensions: ['.js'],
      // делаем как бы переменную, содержащую в себе часть пути, чтобы не писать его полностью каждый раз
      alias: {
        '@': path.resolve(__dirname, 'src'), // перенаправляет в папку src
        '@core': path.resolve(__dirname, 'src', 'core'),
      }
    },
    devtool: isDev ? 'source-map' : false,
    devServer: {
      port: '8506',
      open: true,
      hot: true,
      //почему-то отказывается работать, не могу найти в официальной документации webpack этого свойства в принципе, так что, видимо, оно уже нахой никому не нужно
      //watchContentBase: true
    },
    plugins: plugins(),
    module: {

      rules: [
        {
          test: /\.s[ac]ss$/i,
          use: [
            // Creates `style` nodes from JS strings
            MiniCssExtractPlugin.loader,
            // Translates CSS into CommonJS
            'css-loader',
            // Compiles Sass to CSS
            'sass-loader',
          ],
        },
        {
          test: /\.m?js$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-env']
            }
          }
        }
      ],
    },
  }
}
