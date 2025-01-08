import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { Observable, map } from 'rxjs'
import { DataItem } from '../models/data-item.model' // Import your interface here if you created one

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private dataUrl = 'assets/data.json'

  constructor (private http: HttpClient) {}

  getData (): Observable<DataItem[]> {
    return this.http.get<DataItem[]>(this.dataUrl).pipe(
      map((dataItems: any[]) =>
        dataItems.map(item => ({
          ...item,
          priceRecommendationPOS: parseFloat(
            (
              (1 - item.discountRecommendation / 100) *
              item.listPricePerUnit *
              item.quantity
            ).toFixed(2)
        ),
        meanValueEUR: ((1-item.meanDiscount)*item.listPricePerUnit*item.quantity),
        standardDeviationValueEUR: (item.standardDeviation*item.listPricePerUnit*item.quantity)

        }))
      )
    )
  }
}
