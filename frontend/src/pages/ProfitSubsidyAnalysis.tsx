import React, { useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';
import { TrendingUp, AlertCircle, Leaf, DollarSign, Zap } from "lucide-react";
import MainLayout from "@/components/Layout/MainLayout";
import Chatbot from "@/components/Chatbot/Chatbot";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLanguage } from "@/contexts/LanguageContext";
import { cropFinanceData } from "@/data/cropFinanceData";
import { calculateProfit, formatCurrency, getTopProfitableCrop } from "@/lib/profitCalculator";
import { cn } from "@/lib/utils";

const states = ["Gujarat", "Maharashtra", "Punjab", "Haryana", "Karnataka"];
const seasons = ["Kharif", "Rabi", "Summer", "Year-round", "All"];

const ProfitSubsidyAnalysis: React.FC = () => {
  const { t } = useLanguage();
  const [area, setArea] = useState<number>(2);
  const [state, setState] = useState<string>("Gujarat");
  const [season, setSeason] = useState<string>("Kharif");
  const [suitabilityScores, setSuitabilityScores] = useState<Record<string, number>>({
    Rice: 0.82,
    Wheat: 0.75,
    Maize: 0.68,
    Chickpea: 0.70,
    Cotton: 0.78,
    Sugarcane: 0.65,
    Banana: 0.72,
    Mango: 0.80
  });

  const results = calculateProfit({
    crops: cropFinanceData,
    suitabilityScores,
    area,
    state,
    season
  });

  const topCrop = getTopProfitableCrop(results);

  const chartData = results.map(item => ({
    name: item.crop,
    profit: item.netProfit,
    revenue: item.revenue,
    cost: item.cost
  }));

  const profitMarginData = results.map(item => ({
    name: item.crop,
    margin: item.profitMargin,
    suitability: item.suitability * 100
  }));

  return (
    <MainLayout>
      <div className="container px-4 py-6 md:px-6 md:py-8">
        {/* Header */}
        <div className="mb-8 animate-fade-up">
          <div className="flex items-center gap-3 mb-2">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-green-500 to-green-600 text-white shadow-lg">
              <DollarSign className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
                💰 Profit & Subsidy Analysis
              </h1>
              <p className="text-muted-foreground">
                Compare estimated profits across different crops for your farm
              </p>
            </div>
          </div>
        </div>

        {/* Warning */}
        <div className="mb-6 p-4 rounded-lg bg-amber-50 border border-amber-200 flex gap-3">
          <AlertCircle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-amber-900">
            <strong>⚠️ Disclaimer:</strong> This analysis is based on estimated regional averages and assumed subsidy rates. 
            Actual profits may vary significantly based on market conditions, actual yields, soil quality, and government policies. 
            Always consult with agricultural experts before making farming decisions.
          </div>
        </div>

        {/* Input Controls */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <div>
            <Label className="text-sm font-medium">Farm Area (Hectares)</Label>
            <Input
              type="number"
              value={area}
              onChange={(e) => setArea(Number(e.target.value))}
              min="0.5"
              max="50"
              step="0.5"
              className="mt-1"
            />
          </div>

          <div>
            <Label className="text-sm font-medium">State</Label>
            <select
              value={state}
              onChange={(e) => setState(e.target.value)}
              className="mt-1 w-full px-3 py-2 border rounded-lg bg-white"
            >
              {states.map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          <div>
            <Label className="text-sm font-medium">Season</Label>
            <select
              value={season}
              onChange={(e) => setSeason(e.target.value)}
              className="mt-1 w-full px-3 py-2 border rounded-lg bg-white"
            >
              {seasons.map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          <div className="flex items-end">
            <Button
              onClick={() => {
                setArea(2);
                setState("Gujarat");
                setSeason("Kharif");
              }}
              variant="outline"
              className="w-full"
            >
              Reset Filters
            </Button>
          </div>
        </div>

        {/* Top Recommendation Card */}
        {topCrop && (
          <div className="mb-8 rounded-2xl bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 p-6 shadow-lg animate-fade-up">
            <div className="flex items-start gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-green-500 text-white">
                <TrendingUp className="h-7 w-7" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-green-900">🏆 Most Profitable Option</h3>
                <p className="text-sm text-green-700 mt-1">
                  <span className="text-2xl font-bold">{topCrop.crop}</span>
                  {' '} with estimated net profit of{' '}
                  <span className="text-2xl font-bold text-green-600">{formatCurrency(topCrop.netProfit)}</span>
                </p>
                <div className="grid grid-cols-3 gap-4 mt-4 text-sm">
                  <div>
                    <p className="text-green-600 font-semibold">Suitability</p>
                    <p className="text-lg font-bold text-green-900">{(topCrop.suitability * 100).toFixed(0)}%</p>
                  </div>
                  <div>
                    <p className="text-green-600 font-semibold">Profit Margin</p>
                    <p className="text-lg font-bold text-green-900">{topCrop.profitMargin.toFixed(1)}%</p>
                  </div>
                  <div>
                    <p className="text-green-600 font-semibold">Total Revenue</p>
                    <p className="text-lg font-bold text-green-900">{formatCurrency(topCrop.revenue)}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Charts Section */}
        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          {/* Net Profit Bar Chart */}
          <div className="rounded-2xl bg-card/80 backdrop-blur-xl border border-border/50 p-6 shadow-soft">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Zap className="h-5 w-5 text-yellow-500" />
              Net Profit Comparison
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
                <YAxis />
                <Tooltip 
                  formatter={(value) => formatCurrency(value as number)}
                  contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', border: 'none', borderRadius: '8px', color: '#fff' }}
                />
                <Bar dataKey="profit" fill="#10b981" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Profit Margin Line Chart */}
          <div className="rounded-2xl bg-card/80 backdrop-blur-xl border border-border/50 p-6 shadow-soft">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-blue-500" />
              Profit Margin & Suitability
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={profitMarginData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
                <YAxis />
                <Tooltip 
                  formatter={(value) => `${(value as number).toFixed(1)}%`}
                  contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', border: 'none', borderRadius: '8px', color: '#fff' }}
                />
                <Legend />
                <Line type="monotone" dataKey="margin" stroke="#3b82f6" strokeWidth={2} name="Profit Margin (%)" />
                <Line type="monotone" dataKey="suitability" stroke="#8b5cf6" strokeWidth={2} name="Suitability (%)" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Detailed Table */}
        <div className="rounded-2xl bg-card/80 backdrop-blur-xl border border-border/50 p-6 shadow-soft overflow-x-auto">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Leaf className="h-5 w-5 text-green-500" />
            Detailed Financial Analysis
          </h3>

          {results.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">
                No suitable crops found for the selected state and season. Try different filters.
              </p>
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead className="border-b border-border">
                <tr className="bg-muted/50">
                  <th className="px-4 py-3 text-left font-semibold">Crop</th>
                  <th className="px-4 py-3 text-right font-semibold">Suitability</th>
                  <th className="px-4 py-3 text-right font-semibold">Yield (tons/ha)</th>
                  <th className="px-4 py-3 text-right font-semibold">Cost</th>
                  <th className="px-4 py-3 text-right font-semibold">Revenue</th>
                  <th className="px-4 py-3 text-right font-semibold">Subsidy</th>
                  <th className="px-4 py-3 text-right font-semibold">Net Profit</th>
                  <th className="px-4 py-3 text-right font-semibold">Margin</th>
                </tr>
              </thead>
              <tbody>
                {results.map((result, idx) => (
                  <tr
                    key={result.crop}
                    className={cn(
                      "border-b border-border/50 hover:bg-muted/30 transition-colors",
                      idx === 0 && "bg-green-50/50"
                    )}
                  >
                    <td className="px-4 py-3 font-medium">
                      {idx === 0 && '🏆 '}
                      {result.crop}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <span className="inline-block px-2 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-semibold">
                        {(result.suitability * 100).toFixed(0)}%
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">{result.adjustedYield.toFixed(2)}</td>
                    <td className="px-4 py-3 text-right text-red-600">{formatCurrency(result.cost)}</td>
                    <td className="px-4 py-3 text-right text-blue-600 font-medium">{formatCurrency(result.revenue)}</td>
                    <td className="px-4 py-3 text-right text-amber-600 font-medium">{formatCurrency(result.subsidy)}</td>
                    <td className="px-4 py-3 text-right font-bold">
                      <span className={result.netProfit > 0 ? 'text-green-600' : 'text-red-600'}>
                        {formatCurrency(result.netProfit)}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right font-semibold">{result.profitMargin.toFixed(1)}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Summary Stats */}
        {results.length > 0 && (
          <div className="grid md:grid-cols-3 gap-4 mt-8">
            <div className="rounded-xl bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 p-4">
              <p className="text-sm text-blue-600 font-medium">Total Investment Required</p>
              <p className="text-2xl font-bold text-blue-900 mt-2">
                {formatCurrency(results.reduce((sum, r) => sum + r.cost, 0))}
              </p>
            </div>
            <div className="rounded-xl bg-gradient-to-br from-green-50 to-green-100 border border-green-200 p-4">
              <p className="text-sm text-green-600 font-medium">Average Net Profit</p>
              <p className="text-2xl font-bold text-green-900 mt-2">
                {formatCurrency(results.reduce((sum, r) => sum + r.netProfit, 0) / results.length)}
              </p>
            </div>
            <div className="rounded-xl bg-gradient-to-br from-amber-50 to-amber-100 border border-amber-200 p-4">
              <p className="text-sm text-amber-600 font-medium">Total Government Subsidy</p>
              <p className="text-2xl font-bold text-amber-900 mt-2">
                {formatCurrency(results.reduce((sum, r) => sum + r.subsidy, 0))}
              </p>
            </div>
          </div>
        )}

        <Chatbot />
      </div>
    </MainLayout>
  );
};

export default ProfitSubsidyAnalysis;


