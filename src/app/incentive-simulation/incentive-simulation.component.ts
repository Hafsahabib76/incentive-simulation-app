import { Component } from '@angular/core'
import { DataService } from '../services/data.service'
import { DataItem } from '../models/data-item.model'
import { normalize } from 'path'

@Component({
  selector: 'app-incentive-simulation',
  templateUrl: './incentive-simulation.component.html',
  styleUrls: ['./incentive-simulation.component.css']
})
export class IncentiveSimulationComponent {
  priceData: DataItem[] = []
  totalPriceRecommendationPOS: number = 0
  totalMeanValueEUR: number = 0
  totalStandardDeviationValueEUR: number = 0

  // Initializing the target, top, and floor values to be calculated later
  targetValue: number = 0
  topValue: number = 0
  floorValue: number = 0

  // Initializing the sliderValue, startingRange, and endingRange
  sliderValue: number = 0
  startingRange: number = 0
  endingRange: number = 10

  offerVolumeListPrice = 10000

  discountProbability = 0
  discountChartData = [
    { name: 'Value 1', value: '' },
    { name: 'Value 2', value: '' },
    { name: 'Value 3', value: this.sliderValue },
    { name: 'Value 4', value: '' },
    { name: 'Value 5', value: '' }
  ]

  constructor (private dataService: DataService) {}

  ngOnInit (): void {
    this.dataService.getData().subscribe({
      next: (data: DataItem[]) => {
        this.priceData = data
        this.calculateTotals()
        this.setTargetTopFloorAndRangeValues()
        this.calculateTotals()
      },
      error: err => console.error('Error fetching data:', err)
    })
  }

  calculateTotals (): void {
    this.totalPriceRecommendationPOS = this.priceData.reduce(
      (total, item) => total + (item.priceRecommendationPOS || 0),
      0
    )

    this.totalMeanValueEUR = this.priceData.reduce(
      (sum, item) => sum + (item.meanValueEUR || 0),
      0
    )
    this.totalStandardDeviationValueEUR = this.priceData.reduce(
      (sum, item) => sum + (item.standardDeviationValueEUR || 0),
      0
    )
  }

  setTargetTopFloorAndRangeValues (): void {
    // Use totalPriceRecommendationPOS to set target, top, and floor values
    this.targetValue = this.totalPriceRecommendationPOS
    this.topValue = Number((this.targetValue * 1.08).toFixed(2))
    this.floorValue = Number((this.targetValue * 0.92).toFixed(2))

    // Calculating and setting the startingRange and  endingRange of the slider
    this.startingRange = Number((this.targetValue * 0.8).toFixed(2))
    this.endingRange = Number((this.targetValue * 1.5).toFixed(2))
  }

  // incentive Chart Data Values
  incentivePercentage = 0
  incentiveChartData = [
    { name: 'Value 1', value: '' },
    { name: 'Value 2', value: '' },
    { name: 'Value 3', value: this.sliderValue }, // This will be updated to slider value
    { name: 'Value 4', value: '' },
    { name: 'Value 5', value: '' }
  ]

  // Method to handle slider value change
  onSliderChange (event: Event) {
    const value = (event.target as HTMLInputElement).value
    const newValue = Number(value) // Convert the slider value to a number
    this.sliderValue = newValue

    // Calculate Incentive Percentage
    this.incentivePercentage = this.calculateIncentiveInterpolation(
      this.sliderValue
    )
    // Update Incentive Bar Chart
    this.updateIncentiveChartData(this.incentivePercentage)

    // Calculate and update the discount probability
    this.discountProbability = this.calculateDiscountProbability()
    // Update Incentive Bar Chart
    this.updateDiscountChartData(this.discountProbability)
  }

  // Function to calculate incentive deal using interpolation formula
  calculateIncentiveInterpolation (value: number) {
    // Determine the incentive based on the value
    if (value < this.floorValue) {
      return 0
    } else if (value >= this.floorValue && value < this.targetValue) {
      // Interpolating between FLOOR and TARGET
      const incentive =
        50 +
        ((value - this.floorValue) / (this.targetValue - this.floorValue)) *
          (100 - 50)
      return Math.round(incentive)
    } else if (value >= this.targetValue && value < this.topValue) {
      // Interpolating between TARGET and TOP
      const incentive =
        100 +
        ((value - this.targetValue) / (this.topValue - this.targetValue)) *
          (200 - 100)
      return Math.round(incentive)
    // } 
    }else {
      return 0 // Return null for values out of defined range
    }
  }

  // Function to update incentive deal chart data
  updateIncentiveChartData (value: number) {
    console.log(value);
    if (value > 0){
      // update the table
      this.incentiveChartData = [
        { name: 'Value 1', value: '' },
        { name: 'Value 2', value: '' },
        { name: 'Incentive', value: value },
        { name: 'Value 4', value: '' },
        { name: 'Value 5', value: '' }
      ]
    } else if (value <= 0 ) {
      const fixedValue: number = 0.01;
      // update the table
      this.incentiveChartData = [
        { name: 'Value 1', value: '' },
        { name: 'Value 2', value: '' },
        { name: 'Incentive', value: fixedValue },
        { name: 'Value 4', value: '' },
        { name: 'Value 5', value: '' }
      ]
    } 
    
  }

  calculateDiscountProbability (): number {
    // Step 1: Calculate the Z-score
    const zScore =
      (this.sliderValue - this.totalMeanValueEUR) /
      this.totalStandardDeviationValueEUR

    // Step 2: Calculate the probability using the normal CDF
    const discountProbability = 1 - this.normCdf(zScore) // Reverse to get lower probability at higher Z-scores

    // Step 3: Convert to percentage range (0-100)
    return discountProbability * 100
  }

  // Error function approximation
  erf (x: number): number {
    // Constants for approximation
    const a1 = 0.254829592
    const a2 = -0.284496736
    const a3 = 1.421413741
    const a4 = -1.453152027
    const a5 = 1.061405429
    const p = 0.3275911

    // Save the sign of x
    const sign = x < 0 ? -1 : 1
    x = Math.abs(x)

    // Approximate the error function
    const t = 1.0 / (1.0 + p * x)
    const y =
      1.0 -
      ((((a5 * t + a4) * t + a3) * t + a2) * t + a1) * t * Math.exp(-x * x)

    return sign * y
  }

  // Normal CDF approximation using the error function
  normCdf (z: number): number {
    return 0.5 * (1 + this.erf(z / Math.sqrt(2)))
  }

  // Function to update incentive deal chart data
  updateDiscountChartData (value: number) {
    // Ensure values are valid numbers
    this.discountChartData = [
      { name: 'Value 1', value: '' },
      { name: 'Value 2', value: '' },
      { name: 'Probability', value: value },
      { name: 'Value 4', value: '' },
      { name: 'Value 5', value: '' }
    ]
  }
}
