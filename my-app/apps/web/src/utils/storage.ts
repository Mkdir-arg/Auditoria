import { WebStorage, initStorage } from '../../../shared/utils/storage'

// Inicializar storage para web
initStorage(new WebStorage())

export { getStorage } from '../../../shared/utils/storage'
