var AuthNavbar = require('../components/AuthNavbar.js');
var Auth = require('../models/Auth.js');
var Conf = require('../config/Config.js');

var Login = module.exports = {
    controller: function () {
        var ctrl = this;
        this.wordNum = m.prop(1);

        if (Auth.keypair()) {
            return m.route('/home');
        }

        this.login = function (e) {
            e.preventDefault();

            if (e.target.mnemonic.value) {
                m.onLoadingStart();
                Auth.mnemonicLogin(e.target.mnemonic.value)
                    .then(function () {
                        m.onLoadingEnd();
                        m.route('/home');
                    })
                    .catch(err => {
                        m.flashError(err.message ? Conf.tr(err.message) : Conf.tr('Service error. Please contact support'));
                    })
            }
        };

        this.phraseEdit = function (value) {
            var words = value.split(' ');
            if (words.length < Conf.mnemonic.totalWordsCount) {
                ctrl.wordNum(words.length);
            } else {
                ctrl.wordNum(Conf.mnemonic.totalWordsCount)
            }
        };
    },

    view: function (ctrl) {
        return <div class="auth-wrapper">
            {m.component(AuthNavbar)}

            <div class="wrapper-page">
                <div className="auth-form">
                    <div class="text-center">
                        <h3>{Conf.tr("Log in to PROSTIR via mnemonic phrase")}</h3>
                    </div>
                    <form class="form-horizontal m-t-20" onsubmit={ctrl.login.bind(ctrl)}>
                        <div id="by-mnemonic" class="tab-pane">
                            <div class="form-group">
                                <div class="col-xs-12">
                                    <label class="control-label text-right">
                                        {Conf.tr("Enter your mnemonic phrase word number $[1] of $[2]", ctrl.wordNum(), Conf.mnemonic.totalWordsCount)}
                                    </label>
                                </div>
                                <div class="col-xs-12">
                                    <textarea class="form-control mnemonic-field"
                                              placeholder={Conf.tr("Mnemonic phrase")}
                                              autocapitalize="none"
                                              name="mnemonic"
                                              oninput={m.withAttr("value", ctrl.phraseEdit.bind(ctrl))}
                                    />
                                    <i class="md md-spellcheck form-control-feedback l-h-34"></i>
                                </div>
                            </div>
                        </div>
                        <div class="form-group m-t-20 text-center">
                            <button
                                class="btn btn-success btn-lg btn-custom waves-effect w-md waves-light m-b-5"
                                type="submit">{Conf.tr("Log in")}
                            </button>
                        </div>
                    </form>
                    <div class="m-t-10">
                        <a href="/" config={m.route} class="">{Conf.tr("Back")}</a>
                    </div>
                </div>
            </div>
        </div>
    }
};
