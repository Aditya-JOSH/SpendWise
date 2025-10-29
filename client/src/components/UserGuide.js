import loginImg from '../assets/images/login-page.png';
import signUpImg from '../assets/images/signup-page.png';
import budgetsImg from '../assets/images/budgets-page.png';
import newBudgetImg from '../assets/images/new-budget.png';
import editBudgetImg from '../assets/images/edit-budget.png';
import transactionsImg from '../assets/images/transactions-page.png';
import newTransactionImg from '../assets/images/new-transaction.png';
import signOutImg from '../assets/images/signout.png';

const UserGuide = () => {
  return (
    <div className="user-guide p-6 max-w-4xl mx-auto">
      <header className="mb-8 text-center">
        <h1 className="text-3xl font-bold mb-2">User Guide</h1>
        <p>
          Welcome to SpendWise! This guide will help you understand how to
          navigate the app, manage your budgets, track your expenses, and make
          the most out of its features.
        </p>
      </header>

      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-2">What is SpendWise?</h2>
        <p>
          SpendWise is a personal finance management tool designed to help you
          create budgets, categorize expenses, and monitor your financial health
          with ease. You can sign up, log in, and start tracking your spending
          in just a few minutes.
        </p>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-2">Signup & Login</h2>
        <ul className="list-disc list-inside space-y-2">
          <li>
            Click the <strong>Create one</strong> button on the login screen to
            create a new account.
            <div className="mt-2">
              <img
                src={loginImg}
                alt="Login Page"
                className="w-full max-w-md rounded shadow"
                />
            </div>
          </li>
          <li>
            Enter your name, email, and password, then click{" "}
            <strong>Create Account</strong>.
            <div className="mt-2">
              <img
                src={signUpImg}
                alt="Sign Up Page"
                className="w-full max-w-md rounded shadow"
                />
            </div>
          </li>
          <li>
            Once registered, you can log in using your email and password.
          </li>
          <li>
            To sign out, click the <strong>profile icon</strong>, then select <strong>Sign Out</strong>.
            <div className="mt-2">
              <img
                src={signOutImg}
                alt="Sign Out Page"
                className="w-full max-w-md rounded shadow"
                />
            </div>
          </li>
        </ul>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-2">Dashboard Overview</h2>
        <p>
          The Dashboard provides a summary of your financial status — total
          income, expenses, and available balance. It also displays quick
          insights into your spending patterns and active budgets.
        </p>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-2">Budgets</h2>
        <ul className="list-disc list-inside space-y-2">
          <li>
            Go to the <strong>Budgets</strong> page from the sidebar.
            <div className="mt-2">
              <img
                src={budgetsImg}
                alt="Budgets Page"
                className="w-full max-w-md rounded shadow"
                />
            </div>
          </li>
          <li>
            Click <strong>New Budget</strong> to create a new one.
            <div className="mt-2">
              <img
                src={newBudgetImg}
                alt="New Budget Page"
                className="w-full max-w-md rounded shadow"
                />
            </div>
          </li>
          <li>Enter the Budget Name and Financial Goal.</li>
          <li>
            Edit an existing budget by clicking the edit button.
            <div className="mt-2">
              <img
                src={editBudgetImg}
                alt="Edit Budget"
                className="w-full max-w-md rounded shadow"
                />
            </div>
          </li>
        </ul>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-2">Categories</h2>
        <p className="mb-2">
          Categories help organize your transactions for better insights.
        </p>
        <ul className="list-disc list-inside space-y-2">
          <li>View all categories under the <strong>Categories</strong> tab.</li>
          <li>Add, edit, or remove categories as per your preferences.</li>
        </ul>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-2">Transactions</h2>
        <ul className="list-disc list-inside space-y-2">
          <li>
            Navigate to the <strong>Transactions</strong> page.
            <div className="mt-2">
              <img
                src={transactionsImg}
                alt="Transactions Page"
                className="w-full max-w-md rounded shadow"
                />
            </div>
          </li>
          <li>
            Use filters or the search bar to find transactions quickly.
          </li>
          <li>Delete or edit entries anytime to maintain accuracy.</li>
          <li>
            Click <strong>New Transaction</strong> to record an expense or income.
            <div className="mt-2">
              <img
                src={newTransactionImg}
                alt="New Transaction Page"
                className="w-full max-w-md rounded shadow"
                />
            </div>
          </li>
          <li>Enter the description, budget, category, amount, date, and click <strong>Add Transaction</strong> to create a new transaction.</li>
        </ul>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-2">Need Help?</h2>
        <p>
            If you face any issues or have questions, please reach out via the project’s
            <a
              href="https://github.com/Limeload/SpendWise/issues"
              target="_blank"
              rel="noopener noreferrer"
              className="blue-link"
            >
              GitHub Issues page
            </a>
            .
        </p>
      </section>
    </div>
  );
};

export default UserGuide;
