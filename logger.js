const {createLogger, format, transports} = require('winston');

const appendTimestamp = format((info, opts) => {
  if(opts.tz)
    info.timestamp = new Date().toLocaleString();
  return info;
});

module.exports = createLogger({
  transports:[
    new transports.File({
      level: 'info',
      filename: './logs/logfile.log',
      format: format.combine(
        format.simple(),
        format.timestamp(),
        appendTimestamp({ tz: 'Europe/Lisbon' }),
        format.printf(info=>`[${info.timestamp}] ${info.message}`)
      ),
    })
  ]
})
