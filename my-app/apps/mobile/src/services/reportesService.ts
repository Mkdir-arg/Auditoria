import apiClient from './apiClient'
import { createReportesService } from '../../../shared/services/reportesService'

export const reportesService = createReportesService(apiClient)
