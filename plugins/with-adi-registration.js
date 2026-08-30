const { withDangerousMod } = require('expo/config-plugins')
const fs = require('fs')
const path = require('path')

// Play Console "Sign and upload an APK" snippet — must match byte-for-byte.
const ADI_SNIPPET = 'CKQ6KPFNWDCXEAAAAAAAAAAAAA'

module.exports = function withAdiRegistration(config) {
    return withDangerousMod(config, [
        'android',
        async (config) => {
            const assetsDir = path.join(
                config.modRequest.platformProjectRoot,
                'app',
                'src',
                'main',
                'assets'
            )
            fs.mkdirSync(assetsDir, { recursive: true })
            fs.writeFileSync(
                path.join(assetsDir, 'adi-registration.properties'),
                ADI_SNIPPET,
                'utf8'
            )
            return config
        },
    ])
}
