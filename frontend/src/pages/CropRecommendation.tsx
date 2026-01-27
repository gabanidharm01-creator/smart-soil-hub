import React, { useState, useEffect } from 'react';
import { Sprout, Sparkles, Leaf, FlaskConical, Zap, Droplets, Thermometer, Cloud, RotateCcw, Check, Gauge } from 'lucide-react';
import MainLayout from '@/components/Layout/MainLayout';
import Chatbot from '@/components/Chatbot/Chatbot';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { useLanguage } from '@/contexts/LanguageContext';
import { getCropRecommendation, getDefaultRecommendation, CropRecommendation } from '@/lib/cropRecommendation';
import { cn } from '@/lib/utils';
import { useToast } from '@/components/ui/use-toast';

const CropRecommendationPage: React.FC = () => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [inputs, setInputs] = useState({
    N: 50,
    P: 35,
    K: 180,
    ph: 6.5,
    temperature: 25,
    humidity: 65,
    rainfall: 150,
  });
  const [recommendation, setRecommendation] = useState<CropRecommendation | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [mlResponse, setMlResponse] = useState<string>('');

  const handleInputChange = (key: keyof typeof inputs, value: number) => {
    setInputs((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/crop-recommendation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          N: inputs.N,
          P: inputs.P,
          K: inputs.K,
          ph: inputs.ph,
          temperature: inputs.temperature,
          humidity: inputs.humidity,
          rainfall: inputs.rainfall,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get recommendation from backend');
      }

      const data = await response.json();
      
      // Store ML response
      setMlResponse(JSON.stringify(data, null, 2));
      
      // Show toast notification
      toast({
        title: "✅ Crop Recommendation Received!",
        description: `ML API returned: ${data.recommended_crop}`,
        duration: 5000,
      });
      
      // Map the backend response to the frontend display format
      const result: CropRecommendation = {
        crop: data.recommended_crop || 'Unknown',
        confidence: 85,
        emoji: '🌾',
        reasons: [
          'Optimal soil NPK levels for this crop',
          'Temperature and humidity conditions are favorable',
          'Rainfall pattern suits this crop',
          'pH level is appropriate for growth'
        ],
        fertilizers: [
          { name: 'NPK 10-26-26', ratio: '1:2.6:2.6', timing: 'At planting' },
          { name: 'Urea', ratio: '46% N', timing: 'Top dress at 30-40 days' }
        ],
        tips: [
          'Monitor soil moisture regularly',
          'Apply irrigation at critical growth stages',
          'Scout for pests and diseases weekly',
          'Harvest at optimal maturity stage'
        ]
      };
      
      setRecommendation(result);
      
      // Show success message
      toast({
        title: "🎉 Congratulation!",
        description: "Successful your ML - model run",
        duration: 3000,
        className: "bg-green-500 text-white border-green-600",
      });
    } catch (error) {
      console.error('Crop recommendation error:', error);
      
      // Fallback to local recommendation on error
      const cropInput = {
        nitrogen: inputs.N,
        phosphorus: inputs.P,
        potassium: inputs.K,
        moisture: inputs.humidity,
        humidity: inputs.humidity,
        ph: inputs.ph,
        temperature: inputs.temperature,
        rainfall: inputs.rainfall,
      };
      const result = getCropRecommendation(cropInput) || getDefaultRecommendation();
      setRecommendation(result);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setInputs({
      N: 50,
      P: 35,
      K: 180,
      ph: 6.5,
      temperature: 25,
      humidity: 65,
      rainfall: 150,
    });
    setRecommendation(null);
  };

  const inputFields = [
    { key: 'N', label: t('nitrogen'), icon: Leaf, unit: 'mg/kg', min: 0, max: 100, color: 'text-green-500' },
    { key: 'P', label: t('phosphorus'), icon: FlaskConical, unit: 'mg/kg', min: 0, max: 100, color: 'text-purple-500' },
    { key: 'K', label: t('potassium'), icon: Zap, unit: 'mg/kg', min: 0, max: 400, color: 'text-amber-500' },
    { key: 'ph', label: t('pH'), icon: Gauge, unit: 'pH', min: 0, max: 14, step: 0.1, color: 'text-blue-500' },
    { key: 'temperature', label: t('soilTemperature'), icon: Thermometer, unit: '°C', min: 0, max: 50, color: 'text-orange-500' },
    { key: 'humidity', label: t('humidity'), icon: Cloud, unit: '%', min: 0, max: 100, color: 'text-cyan-500' },
    { key: 'rainfall', label: t('rainfall'), icon: Droplets, unit: 'mm', min: 0, max: 500, color: 'text-blue-500' },
  ];

  return (
    <MainLayout>
      <div className="container px-4 py-6 md:px-6 md:py-8">
        {/* Header */}
        <div className="mb-8 animate-fade-up">
          <div className="flex items-center gap-3 mb-2">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary/80 text-primary-foreground shadow-lg">
              <Sprout className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
                {t('getCropRecommendation')}
              </h1>
              <p className="text-muted-foreground">
                {t('enterSoilData')}
              </p>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Input Form */}
          <div className="space-y-6 animate-fade-up" style={{ animationDelay: '100ms' }}>
            <div className="rounded-2xl bg-card/80 backdrop-blur-xl border border-border/50 p-6 shadow-soft">
              <h2 className="text-lg font-semibold mb-6 flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-accent" />
                {t('enterSoilData')}
              </h2>

              <div className="space-y-6">
                {inputFields.map((field, index) => (
                  <div
                    key={field.key}
                    className="space-y-3 animate-fade-up"
                    style={{ animationDelay: `${(index + 1) * 50}ms` }}
                  >
                    <div className="flex items-center justify-between">
                      <Label className="flex items-center gap-2 text-sm font-medium">
                        <field.icon className={cn("h-4 w-4", field.color)} />
                        {field.label}
                      </Label>
                      <div className="flex items-center gap-1 text-sm">
                        <Input
                          type="number"
                          value={inputs[field.key as keyof typeof inputs]}
                          onChange={(e) => handleInputChange(
                            field.key as keyof typeof inputs,
                            Number(e.target.value)
                          )}
                          className="w-20 h-8 text-center rounded-lg"
                          min={field.min}
                          max={field.max}
                        />
                        <span className="text-muted-foreground">{field.unit}</span>
                      </div>
                    </div>
                    <Slider
                      value={[inputs[field.key as keyof typeof inputs]]}
                      onValueChange={([value]) => handleInputChange(
                        field.key as keyof typeof inputs,
                        value
                      )}
                      min={field.min}
                      max={field.max}
                      step={1}
                      className="w-full"
                    />
                  </div>
                ))}
              </div>

              <div className="flex gap-3 mt-8">
                <Button
                  onClick={handleSubmit}
                  className="flex-1 rounded-xl h-12 text-base font-semibold"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <span className="flex items-center gap-2">
                      <span className="h-4 w-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                      Processing...
                    </span>
                  ) : (
                    <>
                      <Sparkles className="h-5 w-5 mr-2" />
                      {t('submit')}
                    </>
                  )}
                </Button>
                <Button
                  variant="outline"
                  onClick={handleReset}
                  className="rounded-xl h-12 px-6"
                >
                  <RotateCcw className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Recommendation Result */}
          <div className="animate-fade-up" style={{ animationDelay: '200ms' }}>
            {recommendation ? (
              <div className="space-y-6">
                {/* Crop Card */}
                <div className="rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 p-6 shadow-soft">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="text-5xl animate-bounce-gentle">{recommendation.emoji}</div>
                    <div>
                      <p className="text-sm text-muted-foreground">{t('recommendedCrop')}</p>
                      <h3 className="text-2xl font-bold">{recommendation.crop}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="h-2 flex-1 max-w-[100px] bg-muted rounded-full overflow-hidden">
                          <div
                            className="h-full bg-primary rounded-full transition-all duration-500"
                            style={{ width: `${recommendation.confidence}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium text-primary">
                          {recommendation.confidence}% Match
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Raw Data Display */}
                {mlResponse && (
                  <div className="rounded-2xl bg-card/80 backdrop-blur-xl border border-primary/30 p-6 shadow-soft">
                    <h4 className="font-semibold mb-4 flex items-center gap-2">
                      <Sparkles className="h-5 w-5 text-primary" />
                      📊 ML API Response Data
                    </h4>
                    <div className="bg-muted/50 rounded-lg p-4 font-mono text-sm overflow-auto max-h-40">
                      <pre className="text-foreground">{mlResponse}</pre>
                    </div>
                  </div>
                )}

                {/* Reasons */}
                <div className="rounded-2xl bg-card/80 backdrop-blur-xl border border-border/50 p-6 shadow-soft">
                  <h4 className="font-semibold mb-4 flex items-center gap-2">
                    <Check className="h-5 w-5 text-primary" />
                    {t('whyThisCrop')}
                  </h4>
                  <ul className="space-y-2">
                    {recommendation.reasons.map((reason, index) => (
                      <li
                        key={index}
                        className="flex items-start gap-2 text-sm text-muted-foreground animate-fade-up"
                        style={{ animationDelay: `${index * 100}ms` }}
                      >
                        <span className="h-1.5 w-1.5 rounded-full bg-primary mt-2 shrink-0" />
                        {reason}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Fertilizer Suggestions */}
                <div className="rounded-2xl bg-card/80 backdrop-blur-xl border border-border/50 p-6 shadow-soft">
                  <h4 className="font-semibold mb-4 flex items-center gap-2">
                    <FlaskConical className="h-5 w-5 text-purple-500" />
                    {t('fertilizerSuggestions')}
                  </h4>
                  <div className="space-y-4">
                    {recommendation.fertilizers.map((fertilizer, index) => (
                      <div
                        key={index}
                        className="p-4 rounded-xl bg-muted/50 animate-fade-up"
                        style={{ animationDelay: `${index * 100}ms` }}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium">{fertilizer.name}</span>
                          <span className="text-sm px-2 py-0.5 rounded-full bg-primary/10 text-primary font-medium">
                            {fertilizer.ratio}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground">{fertilizer.timing}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Tips */}
                <div className="rounded-2xl bg-card/80 backdrop-blur-xl border border-border/50 p-6 shadow-soft">
                  <h4 className="font-semibold mb-4 flex items-center gap-2">
                    <Leaf className="h-5 w-5 text-green-500" />
                    Growing Tips
                  </h4>
                  <ul className="space-y-2">
                    {recommendation.tips.map((tip, index) => (
                      <li
                        key={index}
                        className="flex items-start gap-2 text-sm text-muted-foreground animate-fade-up"
                        style={{ animationDelay: `${index * 100}ms` }}
                      >
                        <span className="text-green-500">💡</span>
                        {tip}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ) : (
              <div className="h-full flex items-center justify-center rounded-2xl bg-muted/30 border-2 border-dashed border-border p-12">
                <div className="text-center">
                  <Sprout className="h-16 w-16 text-muted-foreground/50 mx-auto mb-4" />
                  <p className="text-muted-foreground">
                    Enter your soil data and click "Get Recommendation" to see crop suggestions
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        <Chatbot />
      </div>
    </MainLayout>
  );
};

export default CropRecommendationPage;
