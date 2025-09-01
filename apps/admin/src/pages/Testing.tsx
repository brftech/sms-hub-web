import { useState, useEffect } from "react";
import { useHub } from "@sms-hub/ui";
import {
  Play,
  Square,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Clock,
  RefreshCw,
  FileText,
  Code,
  Database,
  Globe,
  Zap,
} from "lucide-react";
import {
  testingService,
  TestResult,
  TestSuite,
  TestRunResult,
} from "../services/testingService";
import { dataCleanupService } from "../services/dataCleanupService";

const Testing = () => {
  const { currentHub } = useHub();
  const [testSuites, setTestSuites] = useState<TestSuite[]>([
    {
      name: "Unit Tests",
      tests: [],
      totalTests: 0,
      passedTests: 0,
      failedTests: 0,
      duration: 0,
      status: "idle",
    },
    {
      name: "Integration Tests",
      tests: [],
      totalTests: 0,
      passedTests: 0,
      failedTests: 0,
      duration: 0,
      status: "idle",
    },
    {
      name: "Database Tests",
      tests: [],
      totalTests: 0,
      passedTests: 0,
      failedTests: 0,
      duration: 0,
      status: "idle",
    },
  ]);
  const [isRunning, setIsRunning] = useState(false);
  const [overallStatus, setOverallStatus] = useState<
    "idle" | "running" | "completed"
  >("idle");
  const [lastRunTime, setLastRunTime] = useState<Date | null>(null);

  const runTests = async (suiteName: string) => {
    if (isRunning) return;

    setIsRunning(true);
    setOverallStatus("running");

    // Find the test suite
    const suiteIndex = testSuites.findIndex(
      (suite) => suite.name === suiteName
    );
    if (suiteIndex === -1) return;

    // Update suite status
    const updatedSuites = [...testSuites];
    updatedSuites[suiteIndex].status = "running";
    updatedSuites[suiteIndex].tests = [];
    updatedSuites[suiteIndex].passedTests = 0;
    updatedSuites[suiteIndex].failedTests = 0;
    updatedSuites[suiteIndex].duration = 0;
    setTestSuites(updatedSuites);

    try {
      // Run tests using the testing service
      let result: TestRunResult;

      switch (suiteName) {
        case "Unit Tests":
          result = await testingService.runUnitTests();
          break;
        case "Integration Tests":
          result = await testingService.runIntegrationTests();
          break;
        case "Database Tests":
          result = await testingService.runDatabaseTests();
          break;
        default:
          throw new Error(`Unknown test suite: ${suiteName}`);
      }

      // Update suite with results
      updatedSuites[suiteIndex].tests = result.testResults;
      updatedSuites[suiteIndex].passedTests = result.summary.passedTests;
      updatedSuites[suiteIndex].failedTests = result.summary.failedTests;
      updatedSuites[suiteIndex].duration = result.summary.duration;
      updatedSuites[suiteIndex].totalTests = result.summary.totalTests;
      updatedSuites[suiteIndex].status = "completed";

      setTestSuites([...updatedSuites]);
    } catch (error) {
      console.error("Error running tests:", error);
      // Mark suite as failed
      updatedSuites[suiteIndex].status = "completed";
      setTestSuites([...updatedSuites]);
    } finally {
      setIsRunning(false);
      setOverallStatus("completed");
      setLastRunTime(new Date());
    }
  };

  const runAllTests = async () => {
    if (isRunning) return;

    setIsRunning(true);
    setOverallStatus("running");

    try {
      // Run all tests using the testing service
      const results = await testingService.runAllTests();

      // Update all suites with results
      const updatedSuites = [...testSuites];
      results.forEach((result, index) => {
        if (index < updatedSuites.length) {
          updatedSuites[index].tests = result.testResults;
          updatedSuites[index].passedTests = result.summary.passedTests;
          updatedSuites[index].failedTests = result.summary.failedTests;
          updatedSuites[index].duration = result.summary.duration;
          updatedSuites[index].totalTests = result.summary.totalTests;
          updatedSuites[index].status = "completed";
        }
      });

      setTestSuites(updatedSuites);
    } catch (error) {
      console.error("Error running all tests:", error);
    } finally {
      setIsRunning(false);
      setOverallStatus("completed");
      setLastRunTime(new Date());
    }
  };

  const stopTests = async () => {
    try {
      await testingService.stopTests();
    } catch (error) {
      console.error("Error stopping tests:", error);
    }

    setIsRunning(false);
    setOverallStatus("idle");

    // Reset all running suites
    const updatedSuites = testSuites.map((suite) => ({
      ...suite,
      status: suite.status === "running" ? "idle" : suite.status,
    }));
    setTestSuites(updatedSuites);
  };

  const testDataCleanupService = async () => {
    try {
      console.log("Testing data cleanup service...");

      // Test the connection and get current data counts
      const counts = await dataCleanupService.getCurrentDataCounts();

      console.log("Data cleanup service test successful:", counts);

      alert(
        `✅ Data Cleanup Service Test Successful!\n\nCurrent Data Counts:\n` +
          `• Companies: ${counts.companies}\n` +
          `• Temp Signups: ${counts.tempSignups}\n` +
          `• User Profiles: ${counts.userProfiles}\n` +
          `• Leads: ${counts.leads}\n` +
          `• Auth Users: ${counts.authUsers}\n\n` +
          `The service is working correctly and can connect to Supabase.`
      );
    } catch (error) {
      console.error("Data cleanup service test failed:", error);

      alert(
        `❌ Data Cleanup Service Test Failed!\n\nError: ${error instanceof Error ? error.message : "Unknown error"}\n\n` +
          `This indicates a connection or permission issue with Supabase.`
      );
    }
  };

  const resetTests = () => {
    setTestSuites(
      testSuites.map((suite) => ({
        ...suite,
        tests: [],
        totalTests: 0,
        passedTests: 0,
        failedTests: 0,
        duration: 0,
        status: "idle",
      }))
    );
    setOverallStatus("idle");
    setLastRunTime(null);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "passed":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "failed":
        return <XCircle className="h-4 w-4 text-red-500" />;
      case "running":
        return <RefreshCw className="h-4 w-4 text-blue-500 animate-spin" />;
      case "pending":
        return <Clock className="h-4 w-4 text-gray-400" />;
      default:
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "passed":
        return "text-green-600 bg-green-50 border-green-200";
      case "failed":
        return "text-red-600 bg-red-50 border-red-200";
      case "running":
        return "text-blue-600 bg-blue-50 border-blue-200";
      case "pending":
        return "text-gray-600 bg-gray-50 border-gray-200";
      default:
        return "text-yellow-600 bg-yellow-50 border-yellow-200";
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Testing Dashboard</h1>
        <p className="mt-1 text-sm text-gray-500">
          Run and monitor tests for the {currentHub} hub
        </p>
      </div>

      {/* Action Bar */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          <div className="flex items-center space-x-4">
            {lastRunTime && (
              <div className="flex items-center text-sm text-gray-500">
                <Clock className="w-4 h-4 mr-2" />
                Last run: {lastRunTime.toLocaleTimeString()}
              </div>
            )}
            <button
              onClick={resetTests}
              className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Reset
            </button>
          </div>

          <div className="flex items-center space-x-3">
            {isRunning ? (
              <button
                onClick={stopTests}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                <Square className="h-4 w-4 mr-2" />
                Stop Tests
              </button>
            ) : (
              <button
                onClick={runAllTests}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <Play className="h-4 w-4 mr-2" />
                Run All Tests
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Overall Status */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <div className="p-2 bg-gray-100 rounded-lg">
              <Code className="w-6 h-6 text-gray-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Tests</p>
              <p className="text-2xl font-bold text-gray-900">
                {testSuites.reduce((sum, suite) => sum + suite.totalTests, 0)}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Passed</p>
              <p className="text-2xl font-bold text-green-600">
                {testSuites.reduce((sum, suite) => sum + suite.passedTests, 0)}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <div className="p-2 bg-red-100 rounded-lg">
              <XCircle className="w-6 h-6 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Failed</p>
              <p className="text-2xl font-bold text-red-600">
                {testSuites.reduce((sum, suite) => sum + suite.failedTests, 0)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Test Suites */}
      <div className="space-y-6">
        {testSuites.map((suite, index) => (
          <div
            key={suite.name}
            className="bg-white rounded-lg shadow-sm overflow-hidden"
          >
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  {suite.name === "Unit Tests" && (
                    <Code className="h-5 w-5 text-blue-500" />
                  )}
                  {suite.name === "Integration Tests" && (
                    <Globe className="h-5 w-5 text-green-500" />
                  )}
                  {suite.name === "Database Tests" && (
                    <Database className="h-5 w-5 text-purple-500" />
                  )}
                  <h3 className="text-lg font-medium text-gray-900">
                    {suite.name}
                  </h3>
                  <span
                    className={`px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(suite.status)}`}
                  >
                    {suite.status}
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="text-sm text-gray-500">
                    {suite.passedTests}/{suite.totalTests} passed
                    {suite.duration > 0 && ` • ${suite.duration.toFixed(0)}ms`}
                  </div>
                  {suite.status === "idle" && (
                    <button
                      onClick={() => runTests(suite.name)}
                      disabled={isRunning}
                      className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-blue-600 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                    >
                      <Play className="h-3 w-3 mr-1" />
                      Run
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Test Results */}
            <div className="overflow-x-auto">
              {suite.tests.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <FileText className="h-12 w-12 mx-auto text-gray-300 mb-3" />
                  <p className="text-sm font-medium text-gray-900">
                    No tests run yet
                  </p>
                  <p className="text-sm text-gray-500">
                    Click "Run" to start testing
                  </p>
                </div>
              ) : (
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Test Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Duration
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Time
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {suite.tests.map((test) => (
                      <tr key={test.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            {getStatusIcon(test.status)}
                            <span className="ml-3 text-sm font-medium text-gray-900">
                              {test.name}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(test.status)}`}
                          >
                            {test.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {test.duration
                            ? `${test.duration.toFixed(0)}ms`
                            : "-"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {test.timestamp.toLocaleTimeString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <button
            onClick={() => runTests("Unit Tests")}
            disabled={isRunning}
            className="p-4 text-left border border-gray-200 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 transition-colors duration-200"
          >
            <Code className="h-8 w-8 text-blue-500 mb-2" />
            <h3 className="font-medium text-gray-900">Run Unit Tests</h3>
            <p className="text-sm text-gray-500">
              Test individual components and functions
            </p>
          </button>

          <button
            onClick={() => runTests("Integration Tests")}
            disabled={isRunning}
            className="p-4 text-left border border-gray-200 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 transition-colors duration-200"
          >
            <Globe className="h-8 w-8 text-green-500 mb-2" />
            <h3 className="font-medium text-gray-900">Run Integration Tests</h3>
            <p className="text-sm text-gray-500">
              Test component interactions and data flow
            </p>
          </button>

          <button
            onClick={() => runTests("Database Tests")}
            disabled={isRunning}
            className="p-4 text-left border border-gray-200 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 transition-colors duration-200"
          >
            <Database className="h-8 w-8 text-purple-500 mb-2" />
            <h3 className="font-medium text-gray-900">Run Database Tests</h3>
            <p className="text-sm text-gray-500">
              Test database schema and relationships
            </p>
          </button>

          <button
            onClick={testDataCleanupService}
            className="p-4 text-left border border-gray-200 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-orange-500 transition-colors duration-200"
          >
            <Database className="h-8 w-8 text-orange-500 mb-2" />
            <h3 className="font-medium text-gray-900">Test Data Cleanup</h3>
            <p className="text-sm text-gray-500">
              Test data cleanup service connection
            </p>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Testing;
