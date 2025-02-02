import _ from 'lodash'
import report from 'multiple-cucumber-html-reporter';
// import CatPortalWdioConf from './node_modules/@g4/cat-integration-util/src/ui-hooks/cat-ui-hooks'
exports.config = _.extend(
    {

        //
        // ====================
        // Runner Configuration
        // ====================
        //
        //
        // ==================
        // Specify Test Files
        // ==================
        // Define which test specs should run. The pattern is relative to the directory
        // from which `wdio` was called.
        //
        // The specs are defined as an array of spec files (optionally using wildcards
        // that will be expanded). The test for each spec file will be run in a separate
        // worker process. In order to have a group of spec files run in the same worker
        // process simply enclose them in an array within the specs array.
        //
        // If you are calling `wdio` from an NPM script (see https://docs.npmjs.com/cli/run-script),
        // then the current working directory is where your `package.json` resides, so `wdio`
        // will be called from there.
        //
        specs: [
            './test/features/*.feature',
        ],
        // Patterns to exclude.
        exclude: [
            // 'path/to/excluded/files'
        ],
        //
        // ============
        // Capabilities
        // ============
        // Define your capabilities here. WebdriverIO can run multiple capabilities at the same
        // time. Depending on the number of capabilities, WebdriverIO launches several test
        // sessions. Within your capabilities you can overwrite the spec and exclude options in
        // order to group specific specs to a specific capability.
        //
        // First, you can define how many instances should be started at the same time. Let's
        // say you have 3 different capabilities (Chrome, Firefox, and Safari) and you have
        // set maxInstances to 1; wdio will spawn 3 processes. Therefore, if you have 10 spec
        // files and you set maxInstances to 10, all spec files will get tested at the same time
        // and 30 processes will get spawned. The property handles how many capabilities
        // from the same test should run tests.
        //
        maxInstances: 3,
        //
        // If you have trouble getting all important capabilities together, check out the
        // Sauce Labs platform configurator - a great tool to configure your capabilities:
        // https://saucelabs.com/platform/platform-configurator
        //
        capabilities: [{
            browserName: 'chrome',
            maxInstances: 4,
            acceptInsecureCerts: true,
            'goog:chromeOptions': {
                args: ['--ignore-certificate-errors'],
            },
        }],
        //
        // ===================
        // Test Configurations
        // ===================
        // Define all options that are relevant for the WebdriverIO instance here
        //
        // Level of logging verbosity: trace | debug | info | warn | error | silent
        logLevel: 'silent',
        //
        // Set specific log levels per logger
        // loggers:
        // - webdriver, webdriverio
        // - @wdio/browserstack-service, @wdio/devtools-service, @wdio/sauce-service
        // - @wdio/mocha-framework, @wdio/jasmine-framework
        // - @wdio/local-runner
        // - @wdio/sumologic-reporter
        // - @wdio/cli, @wdio/config, @wdio/utils
        // Level of logging verbosity: trace | debug | info | warn | error | silent
        // logLevels: {
        //     webdriver: 'info',
        //     '@wdio/appium-service': 'info'
        // },
        //
        // If you only want to run your tests until a specific amount of tests have failed use
        // bail (default is 0 - don't bail, run all tests).
        bail: 0,
        //
        // Set a base URL in order to shorten url command calls. If your `url` parameter starts
        // with `/`, the base url gets prepended, not including the path portion of your baseUrl.
        // If your `url` parameter starts without a scheme or `/` (like `some/path`), the base url
        // gets prepended directly.
        baseUrl: "http://localhost:8080",
        //
        // Default timeout for all waitFor* commands.
        waitforTimeout: 10000,
        //
        // Default timeout in milliseconds for request
        // if browser driver or grid doesn't send response
        connectionRetryTimeout: 120000,
        //
        // Default request retries count
        connectionRetryCount: 3,
        //
        // Test runner services
        // Services take over a specific job you don't want to take care of. They enhance
        // your test setup with almost no effort. Unlike plugins, they don't add new
        // commands. Instead, they hook themselves up into the test process.
        services: ['chromedriver'],

        // Framework you want to run your specs with.
        // The following are supported: Mocha, Jasmine, and Cucumber
        // see also: https://webdriver.io/docs/frameworks
        //
        // Make sure you have the wdio adapter package for the specific framework installed
        // before running any tests.
        framework: 'cucumber',
        //
        // The number of times to retry the entire specfile when it fails as a whole
        // specFileRetries: 1,
        //
        // Delay in seconds between the spec file retry attempts
        // specFileRetriesDelay: 0,
        //
        // Whether or not retried specfiles should be retried immediately or deferred to the end of the queue
        // specFileRetriesDeferred: false,
        //
        // Test reporter for stdout.
        // The only one supported by default is 'dot'
        // see also: https://webdriver.io/docs/dot-reporter
        // reporters: ['spec'],
        reporters: [
            [
                'allure',
                {
                    outputDir: './allure-results/',
                    disableWebdriverStepsReporting: false,
                    useCucumberStepReporter: true,
                },
            ],
            [
                'cucumberjs-json', {
                    jsonFolder: './reports/json/cucumber-report.json',
                    language: 'en',
                },
            ],
        ],

        after: async function () {
            report.generate({
                jsonDir: "./reports/json/cucumber-report.json",
                reportPath: "./reports/html/cucumber-report.html",
                ignoreBadJsonFile: true,
                metadata: {
                    browser: {
                        name: "chrome",
                        version: "60",
                    },
                    device: "Local test machine",
                    platform: {
                        name: "ubuntu",
                        version: "16.04",
                    },
                },
                customData: {
                    title: "Run info",
                    data: [
                        { label: "Project", value: "Custom project" },
                        { label: "Release", value: "1.2.3" },
                        { label: "Cycle", value: "B11221.34321" },
                        { label: "Execution Start Time", value: "Nov 19th 2017, 02:31 PM EST" },
                        { label: "Execution End Time", value: "Nov 19th 2017, 02:56 PM EST" },
                    ],
                },
            });

        },



        //
        // If you are using Cucumber you need to specify the location of your step definitions.
        cucumberOpts: {
            // <string[]> (file/dir) require files before executing features
            require: ['./src/step-definitions/*.js', './test/step-definitions/*.js'],
            // <boolean> show full backtrace for errors
            backtrace: true,
            // <string[]> ("extension:module") require files with the given EXTENSION after requiring MODULE (repeatable)
            requireModule: [
                [
                    '@babel/register',
                    {
                        rootMode: 'upward',
                        ignore: ['node_modules'],
                    },
                ],
            ],
            // <boolean> invoke formatters without executing steps
            dryRun: false,
            // <boolean> abort the run on first failure
            failFast: false,
            // <boolean> hide step definition snippets for pending steps
            snippets: true,
            // <boolean> hide source uris
            source: true,
            // <boolean> fail if there are any undefined or pending steps
            strict: false,
            // <string> (expression) only execute the features or scenarios with tags matching the expression
            tagExpression: process.env.tag,
            // <number> timeout for step definitions
            timeout: 60000,
            // <boolean> Enable this config to treat undefined definitions as warnings.
            ignoreUndefinedDefinitions: false,
        },
    },
    // CatPortalWdioConf,
)