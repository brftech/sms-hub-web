import { createLogger } from './logger';

describe('Logger', () => {
  let consoleLogSpy: jest.SpyInstance;
  let consoleErrorSpy: jest.SpyInstance;
  let consoleWarnSpy: jest.SpyInstance;
  let consoleDebugSpy: jest.SpyInstance;

  beforeEach(() => {
    consoleLogSpy = jest.spyOn(console, 'log').mockImplementation();
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
    consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation();
    consoleDebugSpy = jest.spyOn(console, 'debug').mockImplementation();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('Log Levels', () => {
    it('should only log messages at or above the configured level', () => {
      const logger = createLogger({ level: 'warn', enableSentry: false });

      logger.debug('Debug message');
      logger.info('Info message');
      logger.warn('Warning message');
      logger.error('Error message');

      expect(consoleDebugSpy).not.toHaveBeenCalled();
      expect(consoleLogSpy).not.toHaveBeenCalled();
      expect(consoleWarnSpy).toHaveBeenCalledTimes(1);
      expect(consoleErrorSpy).toHaveBeenCalledTimes(1);
    });

    it('should log all levels when set to debug', () => {
      const logger = createLogger({ level: 'debug', enableSentry: false });

      logger.debug('Debug message');
      logger.info('Info message');
      logger.warn('Warning message');
      logger.error('Error message');

      expect(consoleDebugSpy).toHaveBeenCalledTimes(1);
      expect(consoleLogSpy).toHaveBeenCalledTimes(1);
      expect(consoleWarnSpy).toHaveBeenCalledTimes(1);
      expect(consoleErrorSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('Context', () => {
    it('should include context in log messages', () => {
      const logger = createLogger({ 
        level: 'info', 
        enableSentry: false,
        context: { userId: 'user123', hubId: 1 }
      });

      logger.info('Test message');

      expect(consoleLogSpy).toHaveBeenCalled();
      const logCall = consoleLogSpy.mock.calls[0][0];
      expect(logCall).toContain('userId');
      expect(logCall).toContain('user123');
      expect(logCall).toContain('hubId');
    });

    it('should create new logger with additional context', () => {
      const logger = createLogger({ 
        level: 'info', 
        enableSentry: false,
        context: { userId: 'user123' }
      });

      const contextLogger = logger.withContext({ 
        companyId: 'company456',
        requestId: 'req789' 
      });

      contextLogger.info('Test message');

      expect(consoleLogSpy).toHaveBeenCalled();
      const logCall = consoleLogSpy.mock.calls[0][0];
      expect(logCall).toContain('userId');
      expect(logCall).toContain('user123');
      expect(logCall).toContain('companyId');
      expect(logCall).toContain('company456');
      expect(logCall).toContain('requestId');
    });
  });

  describe('Error Logging', () => {
    it('should log error objects', () => {
      const logger = createLogger({ level: 'info', enableSentry: false });
      const error = new Error('Test error');

      logger.error('Error occurred', error);

      expect(consoleErrorSpy).toHaveBeenCalled();
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        expect.stringContaining('Error occurred'),
        error
      );
    });

    it('should handle non-Error objects in error logging', () => {
      const logger = createLogger({ level: 'info', enableSentry: false });

      logger.error('Error occurred', 'String error');

      expect(consoleErrorSpy).toHaveBeenCalled();
      const errorArg = consoleErrorSpy.mock.calls[0][1];
      expect(errorArg).toBeInstanceOf(Error);
      expect(errorArg.message).toBe('String error');
    });
  });

  describe('Data Logging', () => {
    it('should log additional data', () => {
      const logger = createLogger({ level: 'info', enableSentry: false });
      const data = { action: 'user_login', duration: 1500 };

      logger.info('User logged in', data);

      expect(consoleLogSpy).toHaveBeenCalled();
      expect(consoleLogSpy).toHaveBeenCalledWith(
        expect.stringContaining('User logged in'),
        data
      );
    });
  });

  describe('Console Output Control', () => {
    it('should not log to console when disabled', () => {
      const logger = createLogger({ 
        level: 'debug', 
        enableConsole: false,
        enableSentry: false 
      });

      logger.debug('Debug message');
      logger.info('Info message');
      logger.warn('Warning message');
      logger.error('Error message');

      expect(consoleDebugSpy).not.toHaveBeenCalled();
      expect(consoleLogSpy).not.toHaveBeenCalled();
      expect(consoleWarnSpy).not.toHaveBeenCalled();
      expect(consoleErrorSpy).not.toHaveBeenCalled();
    });
  });

  describe('Message Formatting', () => {
    it('should format messages with timestamp and level', () => {
      const logger = createLogger({ level: 'info', enableSentry: false });

      logger.info('Test message');

      expect(consoleLogSpy).toHaveBeenCalled();
      const logMessage = consoleLogSpy.mock.calls[0][0];
      
      // Check for timestamp pattern
      expect(logMessage).toMatch(/\[\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z\]/);
      // Check for level
      expect(logMessage).toContain('[INFO]');
      // Check for message
      expect(logMessage).toContain('Test message');
    });
  });

  describe('Level Changes', () => {
    it('should change log level dynamically', () => {
      const logger = createLogger({ level: 'error', enableSentry: false });

      logger.info('Should not log');
      expect(consoleLogSpy).not.toHaveBeenCalled();

      logger.setLevel('info');
      logger.info('Should log');
      expect(consoleLogSpy).toHaveBeenCalledTimes(1);
    });
  });
});