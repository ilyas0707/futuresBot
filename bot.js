const TelegramBot = require('node-telegram-bot-api')

const token = '5123666737:AAHpIKzIkdtO5CrWNN_3Yw9EQxv41CubmJ0'

const bot = new TelegramBot(token, { polling: true })

console.log('bot server started...')

bot.setMyCommands([
    {command: '/create', description: 'Ввести данные'},
    {command: '/ticker', description: 'Тикер валюты'},
    {command: '/entry', description: 'Цена входа'},
    {command: '/stop', description: 'Стоп'},
    {command: '/take', description: 'Тейк'},
])

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

const fastSignalChoose1 = [
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

const fastSignalChoose2 = [
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

bot.onText(/\/start/, (msg) => {
    const chatId = msg.chat.id

    bot.sendMessage(chatId, `Привет, ${msg.from.first_name}.\n`)
})


bot.onText(/\/create/, (msg) => {
    const chatId = msg.chat.id

    bot.sendMessage(chatId, 'Какой сигнал ты хочешь создать?', {
        reply_markup: {
            inline_keyboard: signalChoose,
        },
    })
})

bot.on('callback_query', (query) => {
    const chatId = query.message.chat.id

    const fastSignalResponse = {
        choose1: '',
        choose2: '',
        choose3: '',
        choose4: '',
        choose5: [

        ]
    }

    if (query.data === 'fastSignal') {
        bot.sendMessage(chatId, 'LONG или SHORT?', {
            reply_markup: {
                inline_keyboard: fastSignalChoose1,
            },
        })

        bot.on('callback_query', (query) => {
            if (query.data) {
                fastSignalResponse.choose1 = query.data

                bot.sendMessage(chatId, 'Тикер монеты?')
            }
        })

        bot.on('message', (msg) => {
            const text = msg.text

            try {
                if (text.includes('/ticker')) {
                    fastSignalResponse.choose2 = text
                    bot.sendMessage(chatId, 'Цена входа?')
                    msg.text = ''
                }

                if (text.includes('/entry')) {
                    fastSignalResponse.choose3 = text
                    bot.sendMessage(chatId, 'Стоп?')
                    msg.text = ''
                }

                if (text.includes('/stop')) {
                    fastSignalResponse.choose4 = text
                    bot.sendMessage(chatId, `${fastSignalResponse.choose1.toUpperCase()}\n${fastSignalResponse.choose2.replace('/ticker ', '')}USDT\nВход ${fastSignalResponse.choose3.replace('/entry ', '')}\nСтоп ${fastSignalResponse.choose4.replace('/stop ', '')}`)
                    msg.text = ''
                }
            } catch (e) {
                bot.sendMessage(chatId, 'Произошла какая то ошибка!')
            }
        })
    }
    
    if (query.data === 'usualSignal') {
        bot.sendMessage(chatId, 'LONG или SHORT?', {
            reply_markup: {
                inline_keyboard: fastSignalChoose1,
            },
        })

        bot.on('callback_query', (query) => {
            if (query.data === 'long' || query.data === 'short') {
                fastSignalResponse.choose1 = query.data

                bot.sendMessage(chatId, 'Тикер монеты?')
            }

            if (query.data === 'yes' || query.data === 'no') {
                if (query.data === 'yes') {
                    bot.sendMessage(chatId, `Тейк ${fastSignalResponse.choose5.length + 1}`)
                }

                if (query.data === 'no') {
                    bot.sendMessage(chatId, `${fastSignalResponse.choose1.toUpperCase()}\n${fastSignalResponse.choose2.replace('/ticker ', '')}USDT\nВход ${fastSignalResponse.choose3.replace('/entry ', '')}\nСтоп ${fastSignalResponse.choose4.replace('/stop ', '')}\n${fastSignalResponse.choose5.map(({ id, text }) => {
                        return `Тейк ${id} - ${text.replace('/take ', '')}`
                    }).join('\n')}`)
                }
            }
        })

        bot.on('message', (msg) => {
            const text = msg.text

            try {
                if (text.includes('/ticker')) {
                    fastSignalResponse.choose2 = text
                    bot.sendMessage(chatId, 'Цена входа?')
                    msg.text = ''
                }

                if (text.includes('/entry')) {
                    fastSignalResponse.choose3 = text
                    bot.sendMessage(chatId, 'Стоп?')
                    msg.text = ''
                }

                if (text.includes('/stop')) {
                    fastSignalResponse.choose4 = text
                    bot.sendMessage(chatId, 'Тейк 1')
                    msg.text = ''
                }

                if (text.includes('/take')) {
                    fastSignalResponse.choose5.push({ id: fastSignalResponse.choose5.length + 1, text: text })
                    
                    if (fastSignalResponse.choose5.length >= 0 && fastSignalResponse.choose5.length < 3) {
                        bot.sendMessage(chatId, `Тейк ${fastSignalResponse.choose5.length + 1}`)
                        msg.text = ''
                    }

                    if (fastSignalResponse.choose5.length >= 3) {
                        bot.sendMessage(chatId, 'Добавить дополнительный тейк?', {
                            reply_markup: {
                                inline_keyboard: fastSignalChoose2,
                            },
                        })
                        msg.text = ''
                    }
                }
            } catch (e) {
                bot.sendMessage(chatId, 'Произошла какая то ошибка!')
            }
        })
    }
})
