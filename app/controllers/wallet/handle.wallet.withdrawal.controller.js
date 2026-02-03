const { DATABASE_DIALECT } = require("../../constants/app_constants");
const { findUserCountByEmail } = require("../user/find.user.count.by.email");
const { findUserCountByReferenceNumber } = require("../user/find.user.count.by.reference.no");
const { withdrawByReferenceNumber } = require("../user/update.wallet.balance.by.reference.no");

const isSQL = DATABASE_DIALECT && DATABASE_DIALECT !== 'mongo';

const walletService = isSQL
    ? require('../user/accounts/store.pg.wallet.transactions')
    : require('../user/accounts/store.mongo.wallet.transactions');

const depositService = isSQL
    ? require('../user/accounts/store.pg.deposit.transactions')
    : require('../user/accounts/store.mongo.deposit.transactions');

const utilityService = isSQL
    ? require('../user/accounts/store.pg.utility.transactions')
    : require('../user/accounts/store.mongo.utility.transactions');

module.exports.HandleWalletWithdraw = async (req, res) => {
    const { email, reference_number, used_credits } = req.body;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(422).json({ errors: errors.array() });
        return;
    }
    try {
        const email_found = await findUserCountByEmail(email);
        if (email_found === 0) {
            res.status(404).json({
                success: false,
                error: true,
                message: "Email not found."
            });
            return;
        }
        const reference_number_found = await findUserCountByReferenceNumber(reference_number);
        if (reference_number_found === 0) {
            res.status(404).json({
                success: false,
                error: true,
                message: "Reference number not found."
            });
            return;
        }
        const response = await withdrawByReferenceNumber(reference_number, used_credits);
        if (response[0]) {
            const walletTransaction = {
                reference_number: reference_number,
                cr: used_credits,
                running_balance: 0.00,
                particular: `USAGE OF ${used_credits} POINTS HAS BEEN CREDITED TO YOUR WALLET A/C WHICH IS IDENTIFIED BY REF_NO: ${reference_number}`
            };
            await walletService.saveUserWalletTransaction(walletTransaction);
            const depositTransaction = {
                reference_number: reference_number,
                dr: used_credits,
                running_balance: 0.00,
                particular: `WITHDRAWAL OF ${used_credits} HAS BEEN MADE BY USER IDENTIFIED BY REF_NO: ${reference_number}`
            };
            await depositService.saveDepositTransaction(depositTransaction);
            const utilityTransaction = {
                reference_number: reference_number,
                dr: used_credits,
                running_balance: 0.00,
                particular: `${used_credits} POINTS HAS BEEN SPENT BY USER IDENTIFIED BY REF_NO: ${reference_number}`
            };
            await utilityService.saveUtilityTransaction(utilityTransaction);
            res.status(200).json({
                success: true,
                error: false,
                message: response[1]
            });
        } else {
            res.status(400).json({
                success: false,
                error: true,
                message: response[1]
            });
        }
    } catch (e) {
        if (e) {
            res.status(500).json({
                success: false,
                error: true,
                message: e?.response?.message || e?.message || 'Something wrong has happened'
            });
        }
    }
};

