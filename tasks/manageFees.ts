import { task } from 'hardhat/config'
import { Options } from '@layerzerolabs/lz-v2-utilities'

task('manage-fees', 'Manage OFT fees')
    .addParam('contract', 'OFT contract address')
    .addOptionalParam('collector', 'Fee collector contract address')
    .addOptionalParam('setDefaultFee', 'Set default fee in basis points (e.g., 100 = 1%)')
    .addOptionalParam('setDestFee', 'Set destination-specific fee: "dstEid:feeBps:enabled" (e.g., "40161:250:true")')
    .addOptionalParam('setRecipient', 'Set fee recipient address')
    .addOptionalParam('previewFee', 'Preview fee for amount: "dstEid:amount" (e.g., "40161:1000000000000000000")')
    .addOptionalParam('targetNetwork', 'Target network name', 'localhost')
    .setAction(async (taskArgs, hre) => {
        const [signer] = await hre.ethers.getSigners()
        
        // Get the OFT contract
        const oft = await hre.ethers.getContractAt('OORTOFTWithFees', taskArgs.contract, signer)
        
        console.log(`Managing fees for OFT: ${taskArgs.contract}`)
        console.log(`Using signer: ${signer.address}`)

        // Set default fee
        if (taskArgs.setDefaultFee) {
            const feeBps = parseInt(taskArgs.setDefaultFee)
            console.log(`Setting default fee to ${feeBps} basis points (${feeBps/100}%)`)
            const tx = await oft.setDefaultFeeBps(feeBps)
            await tx.wait()
            console.log(`✅ Default fee set. Tx: ${tx.hash}`)
        }

        // Set destination-specific fee
        if (taskArgs.setDestFee) {
            const [dstEid, feeBps, enabled] = taskArgs.setDestFee.split(':')
            console.log(`Setting fee for destination ${dstEid}: ${feeBps} bps, enabled: ${enabled}`)
            const tx = await oft.setFeeBps(parseInt(dstEid), parseInt(feeBps), enabled === 'true')
            await tx.wait()
            console.log(`✅ Destination fee set. Tx: ${tx.hash}`)
        }

        // Set fee recipient
        if (taskArgs.setRecipient) {
            console.log(`Setting fee recipient to: ${taskArgs.setRecipient}`)
            const tx = await oft.setFeeRecipient(taskArgs.setRecipient)
            await tx.wait()
            console.log(`✅ Fee recipient set. Tx: ${tx.hash}`)
        }

        // Preview fee
        if (taskArgs.previewFee) {
            const [dstEid, amount] = taskArgs.previewFee.split(':')
            console.log(`Previewing fee for destination ${dstEid}, amount: ${amount}`)
            const result = await oft.previewFee(parseInt(dstEid), amount)
            console.log(`Fee: ${result.fee} tokens`)
            console.log(`Amount after fee: ${result.amountAfterFee} tokens`)
            console.log(`Fee percentage: ${(parseFloat(result.fee.toString()) / parseFloat(amount)) * 100}%`)
        }

        // Show current fee configuration
        console.log('\n📊 Current Fee Configuration:')
        const defaultFee = await oft.defaultFeeBps()
        const feeRecipient = await oft.feeRecipient()
        console.log(`Default fee: ${defaultFee} basis points (${defaultFee/100}%)`)
        console.log(`Fee recipient: ${feeRecipient}`)

        // If preview fee was requested, also show config for that destination
        if (taskArgs.previewFee) {
            const [dstEid] = taskArgs.previewFee.split(':')
            const config = await oft.getFeeConfig(parseInt(dstEid))
            console.log(`\nDestination ${dstEid} config:`)
            console.log(`  Fee BPS: ${config.feeBpsForDestination}`)
            console.log(`  Enabled: ${config.enabled}`)
            console.log(`  Effective fee: ${config.enabled ? config.feeBpsForDestination : config.defaultFee} bps`)
        }
    })

task('manage-fee-collector', 'Manage standalone fee collector')
    .addParam('collector', 'Fee collector contract address')
    .addOptionalParam('setDefaultFee', 'Set default fee in basis points')
    .addOptionalParam('setDestFee', 'Set destination-specific fee: "dstEid:feeBps:enabled"')
    .addOptionalParam('setRecipient', 'Set fee recipient address')
    .addOptionalParam('authorize', 'Authorize caller: "address:true/false"')
    .addOptionalParam('previewFee', 'Preview fee for amount: "dstEid:amount"')
    .setAction(async (taskArgs, hre) => {
        const [signer] = await hre.ethers.getSigners()
        
        const collector = await hre.ethers.getContractAt('OFTFeeCollector', taskArgs.collector, signer)
        
        console.log(`Managing fee collector: ${taskArgs.collector}`)
        console.log(`Using signer: ${signer.address}`)

        if (taskArgs.setDefaultFee) {
            const feeBps = parseInt(taskArgs.setDefaultFee)
            console.log(`Setting default fee to ${feeBps} basis points`)
            const tx = await collector.setDefaultFeeBps(feeBps)
            await tx.wait()
            console.log(`✅ Default fee set. Tx: ${tx.hash}`)
        }

        if (taskArgs.setDestFee) {
            const [dstEid, feeBps, enabled] = taskArgs.setDestFee.split(':')
            console.log(`Setting fee for destination ${dstEid}: ${feeBps} bps, enabled: ${enabled}`)
            const tx = await collector.setFeeBps(parseInt(dstEid), parseInt(feeBps), enabled === 'true')
            await tx.wait()
            console.log(`✅ Destination fee set. Tx: ${tx.hash}`)
        }

        if (taskArgs.setRecipient) {
            console.log(`Setting fee recipient to: ${taskArgs.setRecipient}`)
            const tx = await collector.setFeeRecipient(taskArgs.setRecipient)
            await tx.wait()
            console.log(`✅ Fee recipient set. Tx: ${tx.hash}`)
        }

        if (taskArgs.authorize) {
            const [address, authorized] = taskArgs.authorize.split(':')
            console.log(`Setting authorization for ${address}: ${authorized}`)
            const tx = await collector.setAuthorizedCaller(address, authorized === 'true')
            await tx.wait()
            console.log(`✅ Authorization set. Tx: ${tx.hash}`)
        }

        if (taskArgs.previewFee) {
            const [dstEid, amount] = taskArgs.previewFee.split(':')
            console.log(`Previewing fee for destination ${dstEid}, amount: ${amount}`)
            const fee = await collector.calculateFee(parseInt(dstEid), amount)
            console.log(`Fee: ${fee} tokens`)
            console.log(`Amount after fee: ${BigInt(amount) - BigInt(fee.toString())} tokens`)
        }

        // Show current configuration
        console.log('\n📊 Current Fee Collector Configuration:')
        const defaultFee = await collector.defaultFeeBps()
        const feeRecipient = await collector.feeRecipient()
        console.log(`Default fee: ${defaultFee} basis points (${defaultFee/100}%)`)
        console.log(`Fee recipient: ${feeRecipient}`)
    })