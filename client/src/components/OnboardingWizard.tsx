import { useState } from 'react';
import { Dialog, DialogContent } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Lightbulb, FileText, ImageIcon, CheckCircle2, ChevronRight } from 'lucide-react';
import { celebrateMilestone } from '@/lib/confetti';

interface OnboardingWizardProps {
  open: boolean;
  onComplete: (data: {
    favoriteCategory: string;
    firstIdea: string;
    firstScript: string;
  }) => void;
}

const CATEGORIES = [
  { id: 'Gaming', emoji: '🎮', color: '#2BD4FF' },
  { id: 'Tech', emoji: '💻', color: '#4E4DFF' },
  { id: 'Vlog', emoji: '📹', color: '#F3C94C' },
  { id: 'React', emoji: '😮', color: '#6DFF9C' },
];

const STEPS = [
  {
    id: 1,
    title: "Welcome to TubeStar!",
    subtitle: "Let's make your first video awesome!",
    icon: Sparkles,
  },
  {
    id: 2,
    title: "Pick Your Vibe",
    subtitle: "What kind of videos do you want to make?",
    icon: Lightbulb,
  },
  {
    id: 3,
    title: "Your First Idea",
    subtitle: "Let's brainstorm something cool!",
    icon: Lightbulb,
  },
  {
    id: 4,
    title: "Write Your Hook",
    subtitle: "How will you start your video?",
    icon: FileText,
  },
  {
    id: 5,
    title: "You're Ready!",
    subtitle: "Time to create amazing content!",
    icon: CheckCircle2,
  },
];

export function OnboardingWizard({ open, onComplete }: OnboardingWizardProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [favoriteCategory, setFavoriteCategory] = useState('');
  const [firstIdea, setFirstIdea] = useState('');
  const [firstScript, setFirstScript] = useState('');

  const handleNext = () => {
    if (currentStep < STEPS.length) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handleComplete = () => {
    celebrateMilestone();
    onComplete({
      favoriteCategory,
      firstIdea,
      firstScript,
    });
  };

  const canProceed = () => {
    if (currentStep === 2) return favoriteCategory !== '';
    if (currentStep === 3) return firstIdea.trim() !== '';
    if (currentStep === 4) return firstScript.trim() !== '';
    return true;
  };

  const StepIcon = STEPS[currentStep - 1]?.icon || Sparkles;

  return (
    <Dialog open={open} onOpenChange={() => {}}>
      <DialogContent 
        className="max-w-2xl bg-gradient-to-br from-[#0f1f3f] via-[#0c172c] to-[#0b1322] border-2 border-[#2BD4FF]/30 p-0 overflow-hidden"
        hideClose
      >
        {/* Progress Bar */}
        <div className="w-full h-2 bg-[#122046]">
          <motion.div
            className="h-full bg-gradient-to-r from-[#2BD4FF] to-[#6DFF9C]"
            initial={{ width: '0%' }}
            animate={{ width: `${(currentStep / STEPS.length) * 100}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>

        <div className="p-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              {/* Header */}
              <div className="text-center space-y-4">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-[#2BD4FF] to-[#6DFF9C]">
                  <StepIcon className="h-8 w-8 text-[#0a1628]" />
                </div>
                <div>
                  <h2 className="text-3xl font-display font-bold text-white mb-2">
                    {STEPS[currentStep - 1]?.title}
                  </h2>
                  <p className="text-zinc-400 text-lg">
                    {STEPS[currentStep - 1]?.subtitle}
                  </p>
                </div>
              </div>

              {/* Step Content */}
              <div className="min-h-[250px] flex items-center justify-center">
                {currentStep === 1 && (
                  <div className="text-center space-y-6 max-w-md">
                    <p className="text-xl text-white leading-relaxed">
                      Hey there, future YouTube star! 🌟
                    </p>
                    <p className="text-zinc-300 leading-relaxed">
                      We're going to help you create your first awesome video in just a few quick steps. 
                      This will be fun and easy!
                    </p>
                  </div>
                )}

                {currentStep === 2 && (
                  <div className="w-full max-w-lg">
                    <div className="grid grid-cols-2 gap-4">
                      {CATEGORIES.map((category) => (
                        <button
                          key={category.id}
                          onClick={() => setFavoriteCategory(category.id)}
                          className={`p-6 rounded-2xl border-2 transition-all ${
                            favoriteCategory === category.id
                              ? 'border-white scale-105 shadow-[0_0_30px_rgba(109,255,156,0.3)]'
                              : 'border-zinc-700 hover:border-zinc-600'
                          }`}
                          style={{
                            backgroundColor: `${category.color}15`,
                          }}
                        >
                          <div className="text-5xl mb-3">{category.emoji}</div>
                          <div className="text-xl font-display font-bold text-white">
                            {category.id}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {currentStep === 3 && (
                  <div className="w-full max-w-lg space-y-4">
                    <div className="p-6 bg-[#122046]/50 rounded-xl border border-[#2BD4FF]/20">
                      <p className="text-zinc-300 mb-4">
                        {favoriteCategory === 'Gaming' && "How about: 'My EPIC Fortnite Victory' or 'Top 5 Minecraft Builds'?"}
                        {favoriteCategory === 'Tech' && "How about: 'My Gaming Setup Tour' or 'Cool Apps You Need'?"}
                        {favoriteCategory === 'Vlog' && "How about: 'Day in My Life' or 'What's in My Backpack'?"}
                        {favoriteCategory === 'React' && "How about: 'Reacting to Trending Videos' or 'Try Not to Laugh Challenge'?"}
                      </p>
                    </div>
                    <Input
                      value={firstIdea}
                      onChange={(e) => setFirstIdea(e.target.value)}
                      placeholder="Type your video idea here..."
                      className="h-14 text-lg bg-[#122046] border-[#2BD4FF]/40 text-white"
                    />
                  </div>
                )}

                {currentStep === 4 && (
                  <div className="w-full max-w-lg space-y-4">
                    <div className="p-6 bg-[#122046]/50 rounded-xl border border-[#F3C94C]/20">
                      <p className="text-zinc-300 mb-2">
                        💡 <strong>Pro Tip:</strong> Start with something exciting!
                      </p>
                      <p className="text-sm text-zinc-400">
                        Examples: "What's up everyone!" or "You won't believe this!" or "This is INSANE!"
                      </p>
                    </div>
                    <textarea
                      value={firstScript}
                      onChange={(e) => setFirstScript(e.target.value)}
                      placeholder="Write your opening line..."
                      className="w-full h-32 p-4 bg-[#122046] border-2 border-[#2BD4FF]/40 rounded-xl text-white resize-none focus:outline-none focus:border-[#2BD4FF]"
                    />
                  </div>
                )}

                {currentStep === 5 && (
                  <div className="text-center space-y-6 max-w-md">
                    <div className="text-6xl mb-4">🎉</div>
                    <p className="text-xl text-white leading-relaxed">
                      Amazing work! You've completed your first creative journey!
                    </p>
                    <div className="space-y-3 text-left p-6 bg-[#122046]/50 rounded-xl border border-[#6DFF9C]/20">
                      <div className="flex items-start gap-3">
                        <CheckCircle2 className="h-5 w-5 text-[#6DFF9C] mt-0.5" />
                        <div>
                          <p className="text-white font-semibold">Favorite Category</p>
                          <p className="text-sm text-zinc-400">{favoriteCategory}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <CheckCircle2 className="h-5 w-5 text-[#6DFF9C] mt-0.5" />
                        <div>
                          <p className="text-white font-semibold">Your First Idea</p>
                          <p className="text-sm text-zinc-400">{firstIdea}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <CheckCircle2 className="h-5 w-5 text-[#6DFF9C] mt-0.5" />
                        <div>
                          <p className="text-white font-semibold">Your Hook</p>
                          <p className="text-sm text-zinc-400">{firstScript}</p>
                        </div>
                      </div>
                    </div>
                    <p className="text-zinc-300">
                      Now let's turn these into an amazing video!
                    </p>
                  </div>
                )}
              </div>

              {/* Navigation */}
              <div className="flex justify-between items-center pt-6">
                <div className="text-sm text-zinc-500">
                  Step {currentStep} of {STEPS.length}
                </div>
                
                <Button
                  onClick={handleNext}
                  disabled={!canProceed()}
                  className="gap-2 bg-gradient-to-r from-[#6DFF9C] to-[#4BCC7A] text-[#0a1628] font-bold text-lg px-8 py-6 disabled:opacity-50"
                >
                  {currentStep === STEPS.length ? "Let's Create! 🚀" : "Continue"}
                  {currentStep < STEPS.length && <ChevronRight className="h-5 w-5" />}
                </Button>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </DialogContent>
    </Dialog>
  );
}
