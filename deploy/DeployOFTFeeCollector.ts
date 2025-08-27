import { Contract } from 'ethers'
import { type DeployFunction } from 'hardhat-deploy/types'

import { getNamedAccounts } from 'hardhat'

const contractName = 'OFTFeeCollector'

const deploy: DeployFunction = async (hre) => {
    const { deploy } = hre.deployments
    const {deployer} = await getNamedAccounts();
    console.log(`deploying ${contractName} on network: ${hre.network.name} with ${deployer}`)

    await deploy(contractName, {
        from: deployer,
        args: [deployer, deployer], // owner and initial fee recipient
        log: true,
        waitConfirmations: 1,
        skipIfAlreadyDeployed: true,
    })
}

deploy.tags = [contractName]

export default deploy