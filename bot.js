const { Telegraf } = require('telegraf')

const token = '5123666737:AAHpIKzIkdtO5CrWNN_3Yw9EQxv41CubmJ0'
const bot = new Telegraf(token)

// bot.telegram.setMyCommands([
//     {command: '/create', description: 'Ввести данные'},
//     {command: '/ticker text', description: 'Тикер валюты'},
//     {command: '/entry number', description: 'Цена входа'},
//     {command: '/stop number', description: 'Стоп'},
//     {command: '/take number', description: 'Тейк'}
// ])

bot.settings(async (ctx) => {
    await ctx.setMyCommands([
        {command: '/create', description: 'Ввести данные'},
        {command: '/ticker text', description: 'Тикер валюты'},
        {command: '/entry number', description: 'Цена входа'},
        {command: '/stop number', description: 'Стоп'},
        {command: '/take number', description: 'Тейк'}
    ])
})

const signalChoose = [
    [
        {
            text: 'Создать быстрый сигнал',
            callback_data: 'fastSignal',
        },
    ],
    [
        {
            text: 'Создать обычный сигнал',
            callback_data: 'usualSignal',
        },
    ],
]

const fastSignalChoose = [
    [
        {
            text: 'LONG',
            callback_data: 'long',
        },
    ],
    [
        {
            text: 'SHORT',
            callback_data: 'short',
        },
    ],
]

const usualSignalChoose = [
    [
        {
            text: 'Да',
            callback_data: 'yes',
        },
    ],
    [
        {
            text: 'Нет',
            callback_data: 'no',
        },
    ],
]

bot.command('start', (ctx) => {
    ctx.reply(`Привет, ${ctx.message.from.first_name}.\nДля добавления данных введите /create.`)
})

bot.command('create', (ctx) => {
    ctx.telegram.sendMessage(ctx.message.chat.id, 'Какой сигнал ты хочешь создать?', {
        reply_markup: {
            inline_keyboard: signalChoose,
        },
    })
})

const signalResponse = {
    choose1: '',
    choose2: '',
    choose3: '',
    choose4: '',
    choose5: [

    ],
    choose6: ''
}

bot.action('fastSignal', ctx => {
    signalResponse.choose6 = 'fastSignal'

    ctx.telegram.sendMessage(ctx.chat.id, 'LONG или SHORT?', {
        reply_markup: {
            inline_keyboard: fastSignalChoose,
        },
    })
})

bot.action('usualSignal', ctx => {
    signalResponse.choose6 = 'usualSignal'

    ctx.telegram.sendMessage(ctx.chat.id, 'LONG или SHORT?', {
        reply_markup: {
            inline_keyboard: fastSignalChoose,
        },
    })
})

bot.action('long', ctx => {
    signalResponse.choose1 = ctx.update.callback_query.data

    ctx.reply('Тикер монеты?')
})

bot.action('short', ctx => {
    signalResponse.choose1 = ctx.update.callback_query.data

    ctx.reply('Тикер монеты?')
})

bot.command('ticker', ctx => {
    signalResponse.choose2 = ctx.message.text

    ctx.reply('Цена входа?')
})

bot.command('entry', ctx => {
    signalResponse.choose3 = ctx.message.text

    ctx.reply('Стоп?')
})

bot.command('stop', ctx => {
    signalResponse.choose4 = ctx.message.text

    if (signalResponse.choose6 === 'usualSignal') {
        ctx.reply('Тейк 1')
    } else {
        ctx.reply(`${signalResponse.choose1.toUpperCase()}\n${signalResponse.choose2.replace('/ticker ', '')}USDT\nВход ${signalResponse.choose3.replace('/entry ', '')}\nСтоп ${signalResponse.choose4.replace('/stop ', '')}`)
    }
})

bot.command('take', ctx => {
    signalResponse.choose5.push({ id: signalResponse.choose5.length + 1, text: ctx.message.text })

    if (signalResponse.choose5.length >= 0 && signalResponse.choose5.length < 3) {
        ctx.reply(`Тейк ${signalResponse.choose5.length + 1}`)
    }

    if (signalResponse.choose5.length >= 3) {
        ctx.telegram.sendMessage(ctx.chat.id, 'Добавить дополнительный тейк?', {
            reply_markup: {
                inline_keyboard: usualSignalChoose,
            },
        })
    }
})

bot.action('yes', ctx => {
    ctx.reply(`Тейк ${signalResponse.choose5.length + 1}`)
})

bot.action('no', ctx => {
    ctx.reply(`${signalResponse.choose1.toUpperCase()}\n${signalResponse.choose2.replace('/ticker ', '')}USDT\nВход ${signalResponse.choose3.replace('/entry ', '')}\nСтоп ${signalResponse.choose4.replace('/stop ', '')}\n${signalResponse.choose5.map(({ id, text }) => {
        return `Тейк ${id} - ${text.replace('/take ', '')}`
    }).join('\n')}`)
})

bot.launch()