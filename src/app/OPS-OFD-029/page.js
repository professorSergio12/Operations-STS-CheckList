'use client';

import { useState } from 'react';
import Image from 'next/image';

// Initial number of rows for statement of expenses
const INITIAL_EXPENSE_ROWS = 1;

export default function MooringMasterExpenseSheet() {
  const [formData, setFormData] = useState({
    // Personal Details
    personalDetails: {
      name: '',
      country: '',
      invoiceDate: new Date().toISOString().split('T')[0],
      jobNumber: '',
      operationLocation: '',
    },
    // Bank Details
    bankDetails: {
      accountHolderName: '',
      accountNumber: '',
      ibanOrSortCode: '',
      invoiceCurrency: '',
    },
    // Travel Details
    travelDetails: {
      departureFromHomeTown: {
        date: '',
        time: '',
        remarks: '',
      },
      arrivalAtHomeTown: {
        date: '',
        time: '',
        remarks: '',
      },
    },
    // Statement of Expenses
    statementOfExpenses: new Array(INITIAL_EXPENSE_ROWS).fill(null).map(() => ({
      description: '',
      numberOfDaysOrMisc: '',
      dailyRate: '',
      amount: '',
      officeTotal: 0,
    })),
    // Totals
    totals: {
      subTotal: 0,
      vatAmount: 0,
      grandTotal: 0,
    },
  });

  // Calculate totals for expenses
  const calculateTotals = (expenses, vatAmount) => {
    const updatedExpenses = expenses.map(expense => {
      let officeTotal = 0;
      
      // If numberOfDaysOrMisc and dailyRate are provided, calculate: numberOfDaysOrMisc * dailyRate
      if (expense.numberOfDaysOrMisc && expense.dailyRate) {
        const days = parseFloat(expense.numberOfDaysOrMisc) || 0;
        const rate = parseFloat(expense.dailyRate) || 0;
        officeTotal = days * rate;
      }
      // Otherwise, use amount if provided
      else if (expense.amount) {
        officeTotal = parseFloat(expense.amount) || 0;
      }
      
      return {
        ...expense,
        officeTotal: officeTotal,
      };
    });

    const subTotal = updatedExpenses.reduce((sum, expense) => sum + expense.officeTotal, 0);
    const vat = parseFloat(vatAmount) || 0;
    const grandTotal = subTotal + vat;

    return { updatedExpenses, subTotal, grandTotal };
  };

  // Personal Details handlers
  const handlePersonalDetailsChange = (field, value) => {
    setFormData({
      ...formData,
      personalDetails: {
        ...formData.personalDetails,
        [field]: value,
      },
    });
  };

  // Bank Details handlers
  const handleBankDetailsChange = (field, value) => {
    setFormData({
      ...formData,
      bankDetails: {
        ...formData.bankDetails,
        [field]: value,
      },
    });
  };

  // Travel Details handlers
  const handleTravelDetailsChange = (type, field, value) => {
    setFormData({
      ...formData,
      travelDetails: {
        ...formData.travelDetails,
        [type]: {
          ...formData.travelDetails[type],
          [field]: value,
        },
      },
    });
  };

  // Expense row handlers
  const handleExpenseChange = (index, field, value) => {
    const updatedExpenses = [...formData.statementOfExpenses];
    updatedExpenses[index][field] = value;
    
    const { updatedExpenses: calculatedExpenses, subTotal, grandTotal } = calculateTotals(updatedExpenses, formData.totals.vatAmount);
    
    setFormData({
      ...formData,
      statementOfExpenses: calculatedExpenses,
      totals: {
        ...formData.totals,
        subTotal: subTotal,
        grandTotal: grandTotal,
      },
    });
  };

  // Add expense row
  const handleAddExpenseRow = () => {
    const newExpenses = [
      ...formData.statementOfExpenses,
      {
        description: '',
        numberOfDaysOrMisc: '',
        dailyRate: '',
        amount: '',
        officeTotal: 0,
      },
    ];
    
    const { updatedExpenses, subTotal, grandTotal } = calculateTotals(newExpenses, formData.totals.vatAmount);
    
    setFormData({
      ...formData,
      statementOfExpenses: updatedExpenses,
      totals: {
        ...formData.totals,
        subTotal: subTotal,
        grandTotal: grandTotal,
      },
    });
  };

  // Remove expense row
  const handleRemoveExpenseRow = (index) => {
    if (formData.statementOfExpenses.length > 1) {
      const updatedExpenses = formData.statementOfExpenses.filter((_, i) => i !== index);
      const { updatedExpenses: calculatedExpenses, subTotal, grandTotal } = calculateTotals(updatedExpenses, formData.totals.vatAmount);
      
      setFormData({
        ...formData,
        statementOfExpenses: calculatedExpenses,
        totals: {
          ...formData.totals,
          subTotal: subTotal,
          grandTotal: grandTotal,
        },
      });
    }
  };

  // Totals handlers
  const handleTotalsChange = (field, value) => {
    const vatAmount = field === 'vatAmount' ? value : formData.totals.vatAmount;
    const { subTotal, grandTotal } = calculateTotals(formData.statementOfExpenses, vatAmount);

    setFormData({
      ...formData,
      totals: {
        ...formData.totals,
        [field]: value,
        subTotal: subTotal,
        grandTotal: grandTotal,
      },
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // TODO: Implement API call to save form data
    // eslint-disable-next-line no-console
    console.log('Form Data:', formData);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-7xl mx-auto bg-gray-800 rounded-lg shadow-2xl p-8">
        {/* Header Section */}
        <div className="flex justify-between items-start mb-6 border-b border-gray-700 pb-6">
          <div className="relative w-48 h-20">
            <Image
              src="/image/logo.png"
              alt="OCEANE GROUP - SHIP-TO-SHIP TRANSFER"
              fill
              className="object-contain"
              priority
            />
          </div>
          <div className="flex-1 flex flex-col items-center text-center">
            <h1 className="text-2xl font-bold mb-2">
              Mooring Master Expense Sheet
            </h1>
          </div>
        </div>

        {/* Company Information */}
        <div className="mb-6">
          <div className="text-sm space-y-1">
            <div className="font-bold">OCEANE FENDERS DMCC</div>
            <div>1201, Fortune Tower</div>
            <div>Cluster C, JLT, Dubai</div>
          </div>
        </div>

        {/* Personal Details Section */}
        <div className="mb-6 p-4 border border-gray-600 rounded">
          <h2 className="text-lg font-semibold mb-4">Personal Details</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="name" className="block text-sm mb-1 font-semibold">Name:</label>
              <input
                id="name"
                type="text"
                value={formData.personalDetails.name}
                onChange={(e) => handlePersonalDetailsChange('name', e.target.value)}
                className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white"
              />
            </div>
            <div>
              <label htmlFor="country" className="block text-sm mb-1 font-semibold">Country:</label>
              <input
                id="country"
                type="text"
                value={formData.personalDetails.country}
                onChange={(e) => handlePersonalDetailsChange('country', e.target.value)}
                className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white"
              />
            </div>
            <div>
              <label htmlFor="invoice-date" className="block text-sm mb-1 font-semibold">Date of Invoice:</label>
              <input
                id="invoice-date"
                type="date"
                value={formData.personalDetails.invoiceDate}
                onChange={(e) => handlePersonalDetailsChange('invoiceDate', e.target.value)}
                className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white"
              />
            </div>
            <div>
              <label htmlFor="job-number" className="block text-sm mb-1 font-semibold">Job Number:</label>
              <input
                id="job-number"
                type="text"
                value={formData.personalDetails.jobNumber}
                onChange={(e) => handlePersonalDetailsChange('jobNumber', e.target.value)}
                className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white"
              />
            </div>
            <div className="col-span-2">
              <label htmlFor="operation-location" className="block text-sm mb-1 font-semibold">Location of Operation:</label>
              <input
                id="operation-location"
                type="text"
                value={formData.personalDetails.operationLocation}
                onChange={(e) => handlePersonalDetailsChange('operationLocation', e.target.value)}
                className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white"
              />
            </div>
          </div>
        </div>

        {/* Bank Details Section */}
        <div className="mb-6 p-4 border border-gray-600 rounded">
          <h2 className="text-lg font-semibold mb-4">Bank Details</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="account-holder-name" className="block text-sm mb-1 font-semibold">Name of Account Holder:</label>
              <input
                id="account-holder-name"
                type="text"
                value={formData.bankDetails.accountHolderName}
                onChange={(e) => handleBankDetailsChange('accountHolderName', e.target.value)}
                className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white"
              />
            </div>
            <div>
              <label htmlFor="account-number" className="block text-sm mb-1 font-semibold">Account Number:</label>
              <input
                id="account-number"
                type="text"
                value={formData.bankDetails.accountNumber}
                onChange={(e) => handleBankDetailsChange('accountNumber', e.target.value)}
                className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white"
              />
            </div>
            <div>
              <label htmlFor="iban-sort-code" className="block text-sm mb-1 font-semibold">SORT Code / IBAN Number:</label>
              <input
                id="iban-sort-code"
                type="text"
                value={formData.bankDetails.ibanOrSortCode}
                onChange={(e) => handleBankDetailsChange('ibanOrSortCode', e.target.value)}
                className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white"
              />
            </div>
            <div>
              <label htmlFor="invoice-currency" className="block text-sm mb-1 font-semibold">Currency of Invoice:</label>
              <input
                id="invoice-currency"
                type="text"
                value={formData.bankDetails.invoiceCurrency}
                onChange={(e) => handleBankDetailsChange('invoiceCurrency', e.target.value)}
                className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white"
              />
            </div>
          </div>
        </div>

        {/* Travel Details Section */}
        <div className="mb-6 p-4 border border-gray-600 rounded">
          <h2 className="text-lg font-semibold mb-4">Expense Details</h2>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label htmlFor="departure-date" className="block text-sm mb-1 font-semibold">Date of departure from home town:</label>
              <input
                id="departure-date"
                type="date"
                value={formData.travelDetails.departureFromHomeTown.date}
                onChange={(e) => handleTravelDetailsChange('departureFromHomeTown', 'date', e.target.value)}
                className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white"
              />
            </div>
            <div>
              <label htmlFor="arrival-date" className="block text-sm mb-1 font-semibold">Date of arrival at home town:</label>
              <input
                id="arrival-date"
                type="date"
                value={formData.travelDetails.arrivalAtHomeTown.date}
                onChange={(e) => handleTravelDetailsChange('arrivalAtHomeTown', 'date', e.target.value)}
                className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white"
              />
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-600">
              <thead>
                <tr className="bg-gray-700">
                  <th className="border border-gray-600 p-2 text-left">Date</th>
                  <th className="border border-gray-600 p-2 text-left">Time</th>
                  <th className="border border-gray-600 p-2 text-left">Remarks</th>
                </tr>
              </thead>
              <tbody>
                <tr className="hover:bg-gray-700">
                  <td className="border border-gray-600 p-2">
                    <input
                      type="date"
                      value={formData.travelDetails.departureFromHomeTown.date}
                      onChange={(e) => handleTravelDetailsChange('departureFromHomeTown', 'date', e.target.value)}
                      className="w-full bg-gray-800 border border-gray-600 rounded px-2 py-1 text-white text-sm"
                    />
                  </td>
                  <td className="border border-gray-600 p-2">
                    <input
                      type="time"
                      value={formData.travelDetails.departureFromHomeTown.time}
                      onChange={(e) => handleTravelDetailsChange('departureFromHomeTown', 'time', e.target.value)}
                      className="w-full bg-gray-800 border border-gray-600 rounded px-2 py-1 text-white text-sm"
                    />
                  </td>
                  <td className="border border-gray-600 p-2">
                    <input
                      type="text"
                      value={formData.travelDetails.departureFromHomeTown.remarks}
                      onChange={(e) => handleTravelDetailsChange('departureFromHomeTown', 'remarks', e.target.value)}
                      className="w-full bg-gray-800 border border-gray-600 rounded px-2 py-1 text-white text-sm"
                      placeholder="Remarks"
                    />
                  </td>
                </tr>
                <tr className="hover:bg-gray-700">
                  <td className="border border-gray-600 p-2">
                    <input
                      type="date"
                      value={formData.travelDetails.arrivalAtHomeTown.date}
                      onChange={(e) => handleTravelDetailsChange('arrivalAtHomeTown', 'date', e.target.value)}
                      className="w-full bg-gray-800 border border-gray-600 rounded px-2 py-1 text-white text-sm"
                    />
                  </td>
                  <td className="border border-gray-600 p-2">
                    <input
                      type="time"
                      value={formData.travelDetails.arrivalAtHomeTown.time}
                      onChange={(e) => handleTravelDetailsChange('arrivalAtHomeTown', 'time', e.target.value)}
                      className="w-full bg-gray-800 border border-gray-600 rounded px-2 py-1 text-white text-sm"
                    />
                  </td>
                  <td className="border border-gray-600 p-2">
                    <input
                      type="text"
                      value={formData.travelDetails.arrivalAtHomeTown.remarks}
                      onChange={(e) => handleTravelDetailsChange('arrivalAtHomeTown', 'remarks', e.target.value)}
                      className="w-full bg-gray-800 border border-gray-600 rounded px-2 py-1 text-white text-sm"
                      placeholder="Remarks"
                    />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Statement of Expenses Table */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-4">Statement of Expenses</h2>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-600">
              <thead>
                <tr className="bg-gray-700">
                  <th className="border border-gray-600 p-3 text-left">No. of days / Misc</th>
                  <th className="border border-gray-600 p-3 text-left">Daily Rate</th>
                  <th className="border border-gray-600 p-3 text-left">Amount</th>
                  <th className="border border-gray-600 p-3 text-left">
                    Total (in Dirhams)
                    <div className="text-xs font-normal">For Office Use</div>
                  </th>
                  <th className="border border-gray-600 p-3 text-center w-20">Action</th>
                </tr>
              </thead>
              <tbody>
                {formData.statementOfExpenses.map((expense, index) => (
                  <tr key={index} className="hover:bg-gray-700">
                    <td className="border border-gray-600 p-2">
                      <input
                        type="text"
                        value={expense.description}
                        onChange={(e) => handleExpenseChange(index, 'description', e.target.value)}
                        className="w-full bg-gray-800 border border-gray-600 rounded px-2 py-1 text-white text-sm"
                        placeholder="Description"
                      />
                      <input
                        type="text"
                        value={expense.numberOfDaysOrMisc}
                        onChange={(e) => handleExpenseChange(index, 'numberOfDaysOrMisc', e.target.value)}
                        className="w-full bg-gray-800 border border-gray-600 rounded px-2 py-1 text-white text-sm mt-1"
                        placeholder="No. of days / Misc"
                      />
                    </td>
                    <td className="border border-gray-600 p-2">
                      <input
                        type="number"
                        step="0.01"
                        value={expense.dailyRate}
                        onChange={(e) => handleExpenseChange(index, 'dailyRate', e.target.value)}
                        className="w-full bg-gray-800 border border-gray-600 rounded px-2 py-1 text-white text-sm"
                        placeholder="Daily Rate"
                      />
                    </td>
                    <td className="border border-gray-600 p-2">
                      <input
                        type="number"
                        step="0.01"
                        value={expense.amount}
                        onChange={(e) => handleExpenseChange(index, 'amount', e.target.value)}
                        className="w-full bg-gray-800 border border-gray-600 rounded px-2 py-1 text-white text-sm"
                        placeholder="Amount"
                      />
                    </td>
                    <td className="border border-gray-600 p-2">
                      <input
                        type="text"
                        value={expense.officeTotal.toFixed(2)}
                        readOnly
                        className="w-full bg-gray-700 border border-gray-600 rounded px-2 py-1 text-white text-sm cursor-not-allowed"
                      />
                    </td>
                    <td className="border border-gray-600 p-2 text-center">
                      {formData.statementOfExpenses.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveExpenseRow(index)}
                          className="px-2 py-1 bg-red-600 hover:bg-red-700 rounded text-white text-xs"
                        >
                          Remove
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <button
            type="button"
            onClick={handleAddExpenseRow}
            className="mt-2 px-4 py-2 bg-green-600 hover:bg-green-700 rounded text-white text-sm"
          >
            + Add Row
          </button>
        </div>

        {/* Totals Section */}
        <div className="mb-6 p-4 border border-gray-600 rounded">
          <h2 className="text-lg font-semibold mb-4">Summary</h2>
          <div className="grid grid-cols-3 gap-4 max-w-2xl">
            <div>
              <label htmlFor="sub-total" className="block text-sm mb-1 font-semibold">Sub Total:</label>
              <input
                id="sub-total"
                type="text"
                value={formData.totals.subTotal.toFixed(2)}
                readOnly
                className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white cursor-not-allowed"
              />
            </div>
            <div>
              <label htmlFor="vat-amount" className="block text-sm mb-1 font-semibold">VAT (if applicable):</label>
              <input
                id="vat-amount"
                type="number"
                step="0.01"
                value={formData.totals.vatAmount}
                onChange={(e) => handleTotalsChange('vatAmount', e.target.value)}
                className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white"
              />
            </div>
            <div>
              <label htmlFor="grand-total" className="block text-sm mb-1 font-semibold">Grand Total:</label>
              <input
                id="grand-total"
                type="text"
                value={formData.totals.grandTotal.toFixed(2)}
                readOnly
                className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white cursor-not-allowed font-bold"
              />
            </div>
          </div>
        </div>

        {/* Footer Disclaimer */}
        <div className="mb-6 text-sm text-gray-400 italic">
          All Expenses of whatsoever must be supported by a valid receipt.
        </div>

        {/* Submit Button */}
        <div className="flex justify-end gap-4">
          <button
            type="submit"
            onClick={handleSubmit}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded cursor-pointer transition-colors"
          >
            Submit Expense Sheet
          </button>
        </div>
      </div>
    </div>
  );
}

