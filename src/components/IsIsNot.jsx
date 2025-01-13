import React from 'react';

const IsIsNotCard = ({ data }) => {
    return (
        <div className="bg-white shadow-lg rounded-xl p-6 w-full max-w-screen-lg mx-auto mb-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">{data.title}</h2>
            {/* Problem Statement */}
            <div className="bg-gray-50 p-4 rounded-lg shadow-inner">
                <h3 className="text-lg font-bold text-gray-700 mb-2">Problem Statement</h3>
                <p className="text-gray-600">
                    El problema identificado es una <strong>{data.is.what}</strong>, que ocurre <strong>{data.is.where}</strong> y 
                    <strong> {data.is.when}</strong>. Este problema afecta principalmente a 
                    <strong> {data.is.who}</strong> y tiene un impacto significativo de 
                    <strong> {data.is.howMuch}</strong>. Por otro lado, sabemos que no es una <strong>{data.isNot.what}</strong>, 
                    no ocurre <strong>{data.isNot.where}</strong>, ni <strong>{data.isNot.when}</strong>, 
                    y no afecta a <strong>{data.isNot.who}</strong>, ni tiene un impacto en 
                    <strong> {data.isNot.howMuch}</strong>.
                </p>
            </div>
            <table className="w-full border-collapse border border-gray-300">
                <thead>
                    <tr>
                        <th className="bg-gray-100 text-gray-600 p-3 text-left">Category</th>
                        <th className="bg-gray-100 text-gray-600 p-3 text-left">IS</th>
                        <th className="bg-gray-100 text-gray-600 p-3 text-left">IS NOT</th>
                    </tr>
                </thead>
                <tbody>
                    {[
                        { label: 'WHAT', key: 'what' },
                        { label: 'WHERE', key: 'where' },
                        { label: 'WHEN', key: 'when' },
                        { label: 'WHO', key: 'who' },
                        { label: 'HOW MUCH', key: 'howMuch' },
                    ].map((category, index) => (
                        <tr key={index} className="border-t border-gray-300">
                            <td className="bg-gray-50 p-3 font-semibold text-gray-700">{category.label}</td>
                            <td className="p-3">{data.is[category.key]}</td>
                            <td className="p-3">{data.isNot[category.key]}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default IsIsNotCard;
