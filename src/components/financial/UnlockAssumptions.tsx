import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAssumptionsStore } from '../../store/useAssumptionsStore'
import AssumptionGroup from '../interactive/AssumptionGroup'
import SliderInput from '../interactive/SliderInput'
import PasswordGate from './PasswordGate'
import { formatPercent } from '../../utils/formatPercent'
import type { FinancialModelOptionKey, GrowthPhaseKey, GrowthDivisionKey } from '../../data/investorPortal/baseAssumptions'

const ADMIN_PASSWORD = '123'

interface Props {
  selectedOption: FinancialModelOptionKey
}

const PHASE_LABELS: Record<GrowthPhaseKey, string> = {
  phase2: 'Phase 2 — Strong Scaling (Y6–10)',
  phase3: 'Phase 3 — Mature Expansion (Y11–15)',
  phase4: 'Phase 4 — Stabilized Growth (Y16–20)',
}

const DIVISION_LABELS: Record<GrowthDivisionKey, string> = {
  homeServices: 'Home Services',
  solarRealEstate: 'Solar & Real Estate',
  aerial: 'Aerial Insights',
}

export default function UnlockAssumptions({ selectedOption }: Props) {
  const [expanded, setExpanded] = useState(false)
  const [unlocked, setUnlocked] = useState(false)

  const assumptions = useAssumptionsStore((s) => s.assumptions)
  const setPercentageBackConfig = useAssumptionsStore((s) => s.setPercentageBackConfig)
  const setPartnershipShare = useAssumptionsStore((s) => s.setPartnershipShare)
  const setPartnershipHorizon = useAssumptionsStore((s) => s.setPartnershipHorizon)
  const setGrowthPhaseRate = useAssumptionsStore((s) => s.setGrowthPhaseRate)
  const setGovernance = useAssumptionsStore((s) => s.setGovernance)
  const setAssumption = useAssumptionsStore((s) => s.setAssumption)

  const pb = assumptions.financialModelOption.percentageBack
  const partnership = assumptions.financialModelOption.partnership

  const handleLock = () => {
    setUnlocked(false)
    setExpanded(false)
  }

  return (
    <div className="mt-12 mb-6">
      {!expanded && (
        <div className="text-center">
          <button
            onClick={() => setExpanded(true)}
            className="text-text-dim hover:text-text-secondary text-xs italic underline-offset-4 hover:underline transition-colors"
          >
            Unlock Assumptions
          </button>
        </div>
      )}

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="border-t border-surface-border/60 pt-8 mt-4">
              {!unlocked ? (
                <div className="max-w-md mx-auto text-center">
                  <p className="text-text-muted text-xs uppercase tracking-[0.15em] mb-3">Restricted Access</p>
                  <h3 className="text-text-primary font-display font-semibold text-base mb-4">
                    Editable assumptions are gated.
                  </h3>
                  <PasswordGate expectedPassword={ADMIN_PASSWORD} onUnlock={() => setUnlocked(true)} />
                  <button
                    onClick={() => setExpanded(false)}
                    className="text-text-dim hover:text-text-secondary text-xs mt-4 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-accent-gold text-xs uppercase tracking-[0.15em] font-semibold mb-1">
                        Editable Assumptions
                      </p>
                      <h3 className="text-text-primary font-display font-bold text-xl">
                        Live Model Inputs ({selectedOption === 'percentageBack' ? 'Percentage Back' : 'Partnership'})
                      </h3>
                      <p className="text-text-muted text-xs mt-1">
                        All edits flow through to charts, tables, and milestone totals in real time.
                      </p>
                    </div>
                    <button
                      onClick={handleLock}
                      className="text-text-secondary hover:text-text-primary text-xs font-semibold border border-surface-border hover:border-surface-light px-3 py-1.5 rounded-lg transition-all"
                    >
                      Lock
                    </button>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {selectedOption === 'percentageBack' && (
                      <>
                        <AssumptionGroup title="Investor Profit Shares (Phase 1)" defaultOpen>
                          <SliderInput
                            label="Home Services share"
                            value={pb.homeServicesShare}
                            min={0.05}
                            max={0.30}
                            step={0.01}
                            onChange={(v) => setPercentageBackConfig('homeServicesShare', v)}
                            format={formatPercent}
                          />
                          <SliderInput
                            label="Solar & Real Estate share"
                            value={pb.solarRealEstateShare}
                            min={0.05}
                            max={0.40}
                            step={0.01}
                            onChange={(v) => setPercentageBackConfig('solarRealEstateShare', v)}
                            format={formatPercent}
                          />
                          <SliderInput
                            label="Aerial Insights share"
                            value={pb.aerialShare}
                            min={0.05}
                            max={0.30}
                            step={0.01}
                            onChange={(v) => setPercentageBackConfig('aerialShare', v)}
                            format={formatPercent}
                          />
                        </AssumptionGroup>

                        <AssumptionGroup title="Threshold & Residual" defaultOpen>
                          <SliderInput
                            label="Return threshold multiple"
                            value={pb.returnThresholdMultiple}
                            min={1.0}
                            max={3.0}
                            step={0.05}
                            onChange={(v) => setPercentageBackConfig('returnThresholdMultiple', v)}
                            format={(v) => `${v.toFixed(2)}x`}
                          />
                          <SliderInput
                            label="SREC share"
                            value={pb.srecShare}
                            min={0.10}
                            max={0.80}
                            step={0.05}
                            onChange={(v) => setPercentageBackConfig('srecShare', v)}
                            format={formatPercent}
                          />
                          <SliderInput
                            label="Aerial residual share (post-threshold)"
                            value={pb.aerialResidualShare}
                            min={0.01}
                            max={0.10}
                            step={0.005}
                            onChange={(v) => setPercentageBackConfig('aerialResidualShare', v)}
                            format={formatPercent}
                          />
                        </AssumptionGroup>

                        <AssumptionGroup title="Capital">
                          <SliderInput
                            label="Total capital raise"
                            value={assumptions.capital.totalCapitalRaise}
                            min={10_000_000}
                            max={100_000_000}
                            step={1_000_000}
                            onChange={(v) => setAssumption('capital', 'totalCapitalRaise', v)}
                            format={(v) => `$${(v / 1_000_000).toFixed(0)}M`}
                          />
                        </AssumptionGroup>
                      </>
                    )}

                    {selectedOption === 'partnership' && (
                      <>
                        <AssumptionGroup title="Initial Return Phase Shares" defaultOpen>
                          <SliderInput
                            label="Home Services share"
                            value={partnership.homeServicesShare}
                            min={0.05}
                            max={0.30}
                            step={0.01}
                            onChange={(v) => setPartnershipShare('homeServicesShare', v)}
                            format={formatPercent}
                          />
                          <SliderInput
                            label="Real Estate share (Solar + RE combined)"
                            value={partnership.realEstateShare}
                            min={0.05}
                            max={0.35}
                            step={0.01}
                            onChange={(v) => setPartnershipShare('realEstateShare', v)}
                            format={formatPercent}
                          />
                          <SliderInput
                            label="Aerial Insights share"
                            value={partnership.aerialInsightsShare}
                            min={0.02}
                            max={0.20}
                            step={0.01}
                            onChange={(v) => setPartnershipShare('aerialInsightsShare', v)}
                            format={formatPercent}
                          />
                        </AssumptionGroup>

                        <AssumptionGroup title="Return Threshold & Permanent Phase" defaultOpen>
                          <SliderInput
                            label="Return threshold multiple"
                            value={partnership.returnThresholdMultiple}
                            min={1.0}
                            max={5.0}
                            step={0.05}
                            onChange={(v) => setPartnershipShare('returnThresholdMultiple', v)}
                            format={(v) => `${v.toFixed(2)}x`}
                          />
                          <SliderInput
                            label="Permanent Home Services share"
                            value={partnership.postThresholdHomeServicesShare}
                            min={0.01}
                            max={0.20}
                            step={0.005}
                            onChange={(v) => setPartnershipShare('postThresholdHomeServicesShare', v)}
                            format={formatPercent}
                          />
                          <SliderInput
                            label="Permanent Real Estate share (Solar + RE)"
                            value={partnership.postThresholdRealEstateShare}
                            min={0.01}
                            max={0.20}
                            step={0.005}
                            onChange={(v) => setPartnershipShare('postThresholdRealEstateShare', v)}
                            format={formatPercent}
                          />
                          <SliderInput
                            label="Permanent Aerial Insights share"
                            value={partnership.postThresholdAerialInsightsShare}
                            min={0.005}
                            max={0.10}
                            step={0.005}
                            onChange={(v) => setPartnershipShare('postThresholdAerialInsightsShare', v)}
                            format={formatPercent}
                          />
                        </AssumptionGroup>

                        <AssumptionGroup title="Horizon & Governance" defaultOpen>
                          <SliderInput
                            label="Time horizon"
                            value={partnership.timeHorizonYears}
                            min={5}
                            max={30}
                            step={1}
                            onChange={setPartnershipHorizon}
                            format={(v) => `${v} years`}
                          />
                          <SliderInput
                            label="Board seats appointed"
                            value={partnership.governance.boardSeatsAppointed}
                            min={0}
                            max={7}
                            step={1}
                            onChange={(v) => setGovernance('boardSeatsAppointed', v)}
                            format={(v) => `${v} seat${v === 1 ? '' : 's'}`}
                          />
                        </AssumptionGroup>

                        {(['phase2', 'phase3', 'phase4'] as GrowthPhaseKey[]).map((phase) => (
                          <AssumptionGroup key={phase} title={PHASE_LABELS[phase]}>
                            {(['homeServices', 'solarRealEstate', 'aerial'] as GrowthDivisionKey[]).map((div) => (
                              <SliderInput
                                key={div}
                                label={`${DIVISION_LABELS[div]} YoY growth`}
                                value={partnership.growthPhases[phase][div]}
                                min={0}
                                max={0.50}
                                step={0.01}
                                onChange={(v) => setGrowthPhaseRate(phase, div, v)}
                                format={formatPercent}
                              />
                            ))}
                          </AssumptionGroup>
                        ))}

                        <AssumptionGroup title="Capital">
                          <SliderInput
                            label="Total capital raise"
                            value={assumptions.capital.totalCapitalRaise}
                            min={10_000_000}
                            max={100_000_000}
                            step={1_000_000}
                            onChange={(v) => setAssumption('capital', 'totalCapitalRaise', v)}
                            format={(v) => `$${(v / 1_000_000).toFixed(0)}M`}
                          />
                        </AssumptionGroup>
                      </>
                    )}
                  </div>

                  <p className="text-text-dim text-[10px] italic text-center pt-2">
                    Edits affect this session only — refresh to reset to last-saved state.
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
