// SPDX-License-Identifier: MIT
pragma solidity ^0.8.22;

import "forge-std/Test.sol";
import "../contracts/FeeOFT/FeeUpgradeable.sol";
import "../contracts/FeeOFT/OFTFeeCollector.sol";

/**
 * @title FeeTest
 * @notice Basic tests for fee functionality
 */
contract FeeTest is Test {
    OFTFeeCollector public feeCollector;
    address public owner = address(0x1);
    address public feeRecipient = address(0x2);
    address public oftContract = address(0x3);

    function setUp() public {
        vm.startPrank(owner);
        feeCollector = new OFTFeeCollector(owner, feeRecipient);
        feeCollector.setAuthorizedCaller(oftContract, true);
        vm.stopPrank();
    }

    function testSetDefaultFee() public {
        vm.prank(owner);
        feeCollector.setDefaultFeeBps(250); // 2.5%
        
        assertEq(feeCollector.defaultFeeBps(), 250);
    }

    function testCalculateFee() public {
        vm.prank(owner);
        feeCollector.setDefaultFeeBps(250); // 2.5%
        
        uint256 amount = 1000e18; // 1000 tokens
        uint256 expectedFee = (amount * 250) / 10000; // 25 tokens
        
        uint256 calculatedFee = feeCollector.calculateFee(0, amount);
        assertEq(calculatedFee, expectedFee);
    }

    function testDestinationSpecificFee() public {
        vm.startPrank(owner);
        feeCollector.setDefaultFeeBps(250); // 2.5%
        feeCollector.setFeeBps(30101, 100, true); // 1% for Ethereum
        vm.stopPrank();
        
        uint256 amount = 1000e18;
        
        // Default destination should use default fee
        uint256 defaultFee = feeCollector.calculateFee(0, amount);
        assertEq(defaultFee, (amount * 250) / 10000);
        
        // Ethereum should use specific fee
        uint256 ethFee = feeCollector.calculateFee(30101, amount);
        assertEq(ethFee, (amount * 100) / 10000);
    }

    function testMaxFeeProtection() public {
        vm.prank(owner);
        vm.expectRevert();
        feeCollector.setDefaultFeeBps(1001); // Should fail (>10%)
    }
}